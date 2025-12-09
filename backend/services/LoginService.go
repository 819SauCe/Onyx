package services

import (
	"database/sql"
	"gen-you-ecommerce/config"
	"gen-you-ecommerce/helpers"
	"gen-you-ecommerce/models"
	"gen-you-ecommerce/responses"

	"github.com/gin-gonic/gin"
)

func LoginService(c *gin.Context) {
	tenantPageID := c.GetHeader("X-Tenant-Page-Id")
	if tenantPageID == "" {
		c.JSON(400, responses.UserLoginResponse{Sucess: false, Message: "Tenant not informed."})
		return
	}

	var tenantID string
	err := config.DB.QueryRow(`SELECT id FROM tenants WHERE page_id = $1`, tenantPageID).Scan(&tenantID)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(404, responses.UserLoginResponse{Sucess: false, Message: "Tenant not found"})
			return
		}
		c.JSON(500, responses.UserLoginResponse{Sucess: false, Message: "Database error"})
		return
	}

	var body models.LoginModel
	if err := c.Bind(&body); err != nil {
		c.JSON(400, responses.UserLoginResponse{Sucess: false, Message: "Invalid request body"})
		return
	}

	if err := helpers.ValidateEmail(body.Email); err != nil {
		c.JSON(400, responses.UserLoginResponse{Sucess: false, Message: err.Error()})
		return
	}

	if err := helpers.ValidatePassword(body.Password); err != nil {
		c.JSON(400, responses.UserLoginResponse{Sucess: false, Message: err.Error()})
		return
	}

	exists, err := helpers.EmailExists(c.Request.Context(), config.DB, body.Email)
	if err != nil {
		c.JSON(500, responses.UserLoginResponse{Sucess: false, Message: "Database error"})
		return
	}
	if !exists {
		c.JSON(400, responses.UserLoginResponse{Sucess: false, Message: "Verify email or password"})
		return
	}

	var user helpers.UserData
	var hashedPassword string

	err = config.DB.QueryRow(`
	SELECT 
		u.id,
		u.email,
		u.password,
		COALESCE(u.plan, 'free'),
		COALESCE(p.profile_img, ''),
		COALESCE(p.first_name, ''),
		COALESCE(p.last_name, ''),
		COALESCE(tu.role, 'customer')
	FROM users u
	LEFT JOIN user_profiles p ON p.user_id = u.id
	LEFT JOIN tenant_users tu ON tu.user_id = u.id AND tu.tenant_id = $2
	WHERE u.email = $1
	`, body.Email, tenantID).Scan(
		&user.Id,
		&user.Email,
		&hashedPassword,
		&user.Plan,
		&user.Profile_img,
		&user.First_name,
		&user.Last_name,
		&user.Role,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(400, responses.UserLoginResponse{Sucess: false, Message: "Verify email or password"})
			return
		}
		c.JSON(500, responses.UserLoginResponse{Sucess: false, Message: "Database error"})
		return
	}

	var hasAccess bool
	err = config.DB.QueryRow(`SELECT EXISTS (SELECT 1 FROM tenant_users WHERE user_id = $1 AND tenant_id = $2)`, user.Id, tenantID).Scan(&hasAccess)

	if err != nil {
		c.JSON(500, responses.UserLoginResponse{Sucess: false, Message: "Database error"})
		return
	}

	if !hasAccess {
		c.JSON(403, responses.UserLoginResponse{Sucess: false, Message: "User does not belong to this tenant."})
		return
	}

	if user.Role == "" {
		c.JSON(403, responses.UserLoginResponse{Sucess: false, Message: "User does not belong to this tenant."})
		return
	}

	if !helpers.CheckPasswordHash(body.Password, hashedPassword) {
		c.JSON(400, responses.UserLoginResponse{Sucess: false, Message: "Verify email or password"})
		return
	}

	token, err := helpers.GenerateToken(user)
	if err != nil {
		c.JSON(500, responses.UserLoginResponse{Sucess: false, Message: "Internal error"})
		return
	}

	var logged_timer int
	if !body.Keep_me_logged_in {
		logged_timer = 24
	} else {
		logged_timer = 744
	}

	helpers.SetAuthCookie(c, token, logged_timer)

	c.JSON(200, responses.UserLoginResponse{
		Sucess:  true,
		Message: "Login successful.",
		Data: responses.UserDataLogin{
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
