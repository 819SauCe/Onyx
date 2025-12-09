package services

import (
	"database/sql"
	"gen-you-ecommerce/config"
	"gen-you-ecommerce/helpers"
	"gen-you-ecommerce/models"
	"gen-you-ecommerce/responses"
	"log"

	"github.com/gin-gonic/gin"
)

func RegisterService(c *gin.Context) {
	tenantID := c.MustGet("tenantID").(string)

	var body models.RegisterModel
	if err := c.Bind(&body); err != nil {
		c.JSON(400, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Invalid request body"})
		return
	}

	if err := helpers.ValidateEmail(body.Email); err != nil {
		c.JSON(400, responses.UserRegisterResponse{
			Sucess:  true,
			Message: err.Error()})
		return
	}

	if err := helpers.ValidatePassword(body.Password); err != nil {
		c.JSON(400, responses.UserRegisterResponse{
			Sucess:  true,
			Message: err.Error()})
		return
	}

	exists, err := helpers.EmailExists(c.Request.Context(), config.DB, body.Email)
	if err != nil {
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}
	if exists {
		c.JSON(400, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Email already registered"})
		return
	}

	hashedPassword, err := helpers.HashPassword(body.Password)
	if err != nil {
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Internal error"})
		return
	}

	tx, err := config.DB.BeginTx(c.Request.Context(), &sql.TxOptions{})
	if err != nil {
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}
	defer tx.Rollback()

	var userID, userPlan string
	err = tx.QueryRow(`INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, plan`, body.Email, hashedPassword).Scan(&userID, &userPlan)
	if err != nil {
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}

	_, err = tx.Exec(`INSERT INTO user_profiles (user_id, first_name, last_name) VALUES ($1, $2, $3)`, userID, body.First_name, body.Last_name)
	if err != nil {
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}

	_, err = tx.Exec(`INSERT INTO tenant_users (tenant_id, user_id, role) VALUES ($1, $2, $3)`, tenantID, userID, "user")

	if err != nil {
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}

	user := helpers.UserData{
		Id:          userID,
		Email:       body.Email,
		Profile_img: "",
		First_name:  body.First_name,
		Last_name:   body.Last_name,
		Role:        "user",
	}

	token, err := helpers.GenerateToken(user)
	if err != nil {
		log.Println("Error generating token.:", err)
		c.JSON(500, responses.UserRegisterResponse{
			Sucess:  true,
			Message: "Internal error"})
		return
	}

	var logged_timer int
	if !body.Keep_me_logged_in {
		logged_timer = 24
	} else {
		logged_timer = 744
	}

	helpers.SetAuthCookie(c, token, logged_timer)

	c.JSON(200, responses.UserRegisterResponse{
		Sucess:  true,
		Message: "Registration successful.",
		Data: responses.UserDataRegister{
			Id:         user.Id,
			ProfileImg: user.Profile_img,
			FirstName:  user.First_name,
			LastName:   user.Last_name,
			Email:      user.Email,
			Role:       user.Role,
			Plan:       user.Plan,
		},
	})

}
