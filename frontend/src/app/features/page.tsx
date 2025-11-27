"use client";
import StockChart from '../../components/StockChart';
import styles from './page.module.css';
import { motion } from "framer-motion";

export default function FeaturesPage() {
  return (
    <motion.div className={styles.container} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className={styles.header}>
        <h1 className={styles.title}>Funkcje InvestiGenie</h1>
        <p className={styles.subtitle}>
          Zaawansowane narzędzia do analizy rynku finansowego
        </p>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h2>Wykres S&P 500</h2>
          <p>Interaktywny wykres przedstawiający dane historyczne z pliku CSV</p>
          <StockChart />
        </div>

        <div className={styles.featureCard}>
          <h2>Portfolio Tracker</h2>
          <p>Śledzenie Twojego portfela inwestycyjnego</p>
          <div className={styles.comingSoon}>Wkrótce dostępne</div>
        </div>
      </div>
    </motion.div>
  );
}