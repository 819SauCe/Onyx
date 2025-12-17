import { useState } from "react";
import styles from "../styles/pages/Register.module.scss";
import buttonStyles from "../styles/components/Button.module.scss";
import inputStyles from "../styles/components/Input.module.scss";
import Button from "../components/Button";
import Input from "../components/Input";
import { url } from "../config/Vars";

export function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeepMeLoggedIn(event.target.checked);
  };

  function validate() {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setStatus("error");
      return false;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setStatus("error");
      return false;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return false;
    }
    return true;
  }

  async function handleRegister(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage("");
    setStatus(null);

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await fetch(`${url}/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          keep_me_logged_in: keepMeLoggedIn,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Account created successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 400);
      } else {
        setStatus("error");
        setMessage(data.message || "Could not create your account.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Welcome to our new store!</h1>

        <form onSubmit={handleRegister} noValidate>
          <div className={styles.input_container}>
            <div>
              <label htmlFor="firstName">First Name:</label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" type="text" autoComplete="given-name" className={inputStyles.default_input} required />
            </div>

            <div>
              <label htmlFor="lastName">Last Name:</label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" type="text" autoComplete="family-name" className={inputStyles.default_input} required />
            </div>
          </div>

          <div className={`${styles.row} ${styles["row--full"]}`}>
            <div>
              <label htmlFor="email">Email:</label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" type="email" autoComplete="email" className={inputStyles.default_input} required />
            </div>
          </div>

          <div className={styles.input_container}>
            <div>
              <label htmlFor="password">Password:</label>
              <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" type="password" autoComplete="new-password" className={inputStyles.default_input} required />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Input id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********" type="password" autoComplete="new-password" className={inputStyles.default_input} required />
            </div>
          </div>

          <div className={styles.checkbox_row}>
            <input id="keepMeLoggedIn" type="checkbox" checked={keepMeLoggedIn} onChange={handleCheckboxChange} />
            <label htmlFor="keepMeLoggedIn">Keep me logged in</label>
          </div>

          <Button type="submit" label={loading ? "Creating account…" : "Register"} disabled={loading} className={`${buttonStyles.default_button} ${buttonStyles["default_button--primary"]} ${styles.cta_button}`} />
        </form>

        {message && (
          <div className={`${styles.feedback} ${status === "success" ? styles["feedback--success"] : styles["feedback--error"]}`} role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
