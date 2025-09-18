"use client";
import styles from "./footer.module.css";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer className={styles.footer} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className={styles.text}>© {new Date().getFullYear()} InvestiGenie. All rights reserved.</p>
        </motion.footer>
    );
}
