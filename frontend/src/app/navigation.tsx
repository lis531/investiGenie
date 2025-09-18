import React from "react";
import styles from "./navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>Strona Główna</a>
        </li>
        <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>Funkcje</a>
        </li>
        <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>Kontakt z Bogiem</a>
        </li>
      </ul>
    </nav>
  );
}