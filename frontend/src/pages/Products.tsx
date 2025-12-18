import styles from "../styles/pages/Products.module.scss";
import totvsLogo from "../imgs/totvs_icon.png";
import omieLogo from "../imgs/omie_icon.png";
import tinyLogo from "../imgs/tiny_icon.avif";
import blingLogo from "../imgs/bling_icon.webp";

const erps = [
  { id: "bling", name: "Bling", logo: blingLogo },
  { id: "tiny", name: "Tiny", logo: tinyLogo },
  { id: "omie", name: "Omie", logo: omieLogo },
  { id: "totvs", name: "TOTVS", logo: totvsLogo },
];

export function Products() {
  return (
    <main className={styles.main}>
      <h1>add your products🎉</h1>

      <div className={styles.projectsContainer}>
        <button className={styles.card}>
          <span className={styles.iconWrapper}>
            <span className={styles.plus}>+</span>
          </span>
          <p className={styles.title}>add</p>
          <span className={styles.subtitle}>choose your product</span>
        </button>

        <button className={styles.card}>
          <span className={styles.iconWrapper}>
            <span className={styles.sync}>↻</span>
          </span>
          <p className={styles.title}>import from you ERP</p>
          <span className={styles.subtitle}>connect and sync in minutes</span>

          <div className={styles.erpRow}>
            {erps.map((erp) => (
              <div key={erp.id} className={styles.erpLogo} title={erp.name}>
                <img src={erp.logo} alt={`${erp.name} logo`} />
              </div>
            ))}
          </div>
        </button>
      </div>
    </main>
  );
}
