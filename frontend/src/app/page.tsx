"use client";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Witaj na <span className={styles.brand}>InvestiGenie</span>
          </h1>
          <p className={styles.description}>
            Twoje narzędzie do inteligentnego inwestowania
          </p>
          
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <h3 className={styles.featureHeading}>Analiza</h3>
              <p>Zaawansowana analiza danych finansowych</p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureHeading}>Strategie</h3>
              <p>Sprawdzone strategie inwestycyjne</p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureHeading}>Rekomendacje</h3>
              <p>Personalizowane porady inwestycyjne</p>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
