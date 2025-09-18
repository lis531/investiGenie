"use client";
import React from "react";
import styles from "./navigation.module.css";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav className={styles.nav} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink}>Strona Główna</Link>
          {pathname === '/' && (
            <motion.div className={styles.highlight} layoutId="highlight" transition={{ duration: 0.2, ease: "easeInOut" }} />
          )}
        </li>
        <li className={styles.navItem}>
          <Link href="/features" className={styles.navLink}>Funkcje</Link>
          {pathname === '/features' && (
            <motion.div className={styles.highlight} layoutId="highlight" transition={{ duration: 0.2, ease: "easeInOut" }} />
          )}
        </li>
        <li className={styles.navItem}>
          <Link href="/contact_god" className={styles.navLink}>Kontakt z Bogiem</Link>
          {pathname === '/contact_god' && (
            <motion.div className={styles.highlight} layoutId="highlight" transition={{ duration: 0.2, ease: "easeInOut" }} />
          )}
        </li>
      </ul>
    </motion.nav>
  );
}