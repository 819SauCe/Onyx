import { Link } from "react-router-dom";
import styles from "../styles/pages/HomePage.module.scss";
import buttonStyles from "../styles/components/Button.module.scss";
import RotatingWord from "../components/RotatingWord";

export function HomePage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>
            Build your project
            <br />
            <RotatingWord items={["Easier", "Clearer", "Faster", "Simpler"]} />
          </h1>

          <h2>
            Jester is the ultimate low-code platform for creating everything from full e-commerce stores to landing pages and digital experiences all in one place. Connect with ERPs, manage physical and digital products, and launch your online business without writing a single line of code. Empower
            your team to build, grow, and scale effortlessly.
          </h2>

          <div className={styles.cta}>
            <Link to="/pricing" className={`${buttonStyles.default_button} ${buttonStyles["default_button--primary"]}`}>
              Build now
            </Link>
            <Link to="/register" className={`${buttonStyles.default_button} ${buttonStyles["default_button--secondary"]}`}>
              Watch demo
            </Link>
          </div>
        </div>
      </main>

      {/* Second part */}
      <section></section>
    </>
  );
}
