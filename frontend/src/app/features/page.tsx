"use client";
import StockChart from '../../components/StockChart';
import StrategyComparison from '../../components/StrategyComparison';
import styles from './page.module.css';
import { motion } from "framer-motion";

export default function FeaturesPage() {
  return (
    <motion.div className={styles.container} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className={styles.header}>
        <h1 className={styles.title}>Funkcje InvestiGenie</h1>
        <p className={styles.subtitle}>
          Zaawansowane narzędzia do analizy rynku finansowego
        </p>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <StockChart />
        </div>

        <div className={styles.featureCard}>
          <StrategyComparison />
        </div>
      </div>
    </motion.div>
  );
}