"use client";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className={styles.page}>
      <motion.main className={styles.main} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
        <h1 className={styles.title}>Witaj na <b>InvestiGenie</b></h1>
        <p className={styles.description}>
          Twoje narzędzie do inteligentnego inwestowania!
        </p>
      </motion.main>
    </div>
  );
}
