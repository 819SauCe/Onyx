import styles from "../styles/pages/Store.module.scss";

export function Store() {
  return (
    <main className={styles.main}>
      <h1>Create you page🎉</h1>
      <div className={styles.projectsContainer}>
        <button className={styles.createNewStore}>
          <span className={styles.plus}>+</span>
          <p className={styles.title}>Criar nova loja</p>
          <span className={styles.subtitle}>Comece uma nova experiência</span>
        </button>
      </div>
    </main>
  );
}
