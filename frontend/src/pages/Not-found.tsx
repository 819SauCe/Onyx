import { Link } from "react-router-dom";
import styles from "../styles/pages/NotFound.module.scss";
import buttonStyles from "../styles/components/Button.module.scss";

export function NotFound() {
  return (
    <main className={styles.wrap} aria-labelledby="nf-title">
      <section className={styles.card}>
        <div className={styles.code}>404</div>
        <h1 id="nf-title" className={styles.title}>
          Page not found
        </h1>
        <p className={styles.desc}>The page you’re looking for doesn’t exist or was moved.</p>
        <div className={styles.actions}>
          <Link to="/" className={`${buttonStyles.default_button} ${buttonStyles["default_button--primary"]}`}>
            Go to Home
          </Link>
          <Link to="/store" className={`${buttonStyles.default_button} ${buttonStyles["default_button--secondary"]}`}>
            My Store
          </Link>
        </div>
      </section>
    </main>
  );
}
