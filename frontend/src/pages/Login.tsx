import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import styles from "../styles/pages/Login.module.scss";
import buttonStyles from "../styles/components/Button.module.scss";
import inputStyles from "../styles/components/Input.module.scss";
import { url } from "../config/Vars";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setStatus("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setStatus(null);

      const res = await fetch(`${url}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Login successful!");
        setStatus("success");
        setTimeout(() => {
          window.location.href = "/";
        }, 300);
      } else {
        setMessage(data.message || "Email or password incorrect.");
        setStatus("error");
      }
    } catch (err: any) {
      setMessage("Network error. Please try again later.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.login_container}>
        <h1 className={styles.title_login_container}>Welcome back</h1>

        <form onSubmit={handleLogin} noValidate>
          <div className={styles.input_container}>
            <label htmlFor="email">Email:</label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" type="email" autoComplete="email" className={inputStyles.default_input} required />

            <label htmlFor="password">Password:</label>
            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" type="password" autoComplete="current-password" className={inputStyles.default_input} required />
          </div>

          <Button type="submit" label={loading ? "Signing in…" : "Login"} onClick={() => {}} disabled={loading} className={`${buttonStyles.default_button} ${buttonStyles["default_button--primary"]} ${styles.cta_button}`} />
        </form>

        <div className={styles.links}>
          <p className={styles.forgot_password}>
            Forgot Password? <a href="/forgot-password">Click here</a>
          </p>
          <p className={styles.register_link}>
            Don&apos;t have an account? <a href="/register">Register</a>
          </p>
        </div>

        {message && (
          <div className={`${styles.popup} ${status === "success" ? styles.popup_success : styles.popup_error}`} role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
