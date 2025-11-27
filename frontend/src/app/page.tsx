"use client";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>
            Witaj na <span className={styles.brand}>InvestiGenie</span>
          </h1>
          <p className={styles.description}>
            Twoje narzędzie do inteligentnego inwestowania
          </p>
          
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <h3>📊 Analiza</h3>
              <p>Zaawansowana analiza danych finansowych</p>
            </div>
            <div className={styles.featureCard}>
              <h3>📈 Strategie</h3>
              <p>Sprawdzone strategie inwestycyjne</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🎯 Rekomendacje</h3>
              <p>Personalizowane porady inwestycyjne</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
