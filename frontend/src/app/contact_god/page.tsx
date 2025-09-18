"use client";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function GodContact() {
    return (
        <div className={styles.page}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                <h1 className={styles.title}>Kontakt z Bogiem</h1>
                <p className={styles.description}>
                    Tutaj możesz skontaktować się z Bogiem w sprawie Twoich inwestycji.
                </p>
            </motion.div>
            <motion.form className={styles.form} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                <label className={styles.label}>
                    Imię:
                    <input type="text" className={styles.input} />
                </label>
                <label className={styles.label}>
                    Email:
                    <input type="email" className={styles.input} />
                </label>
                <label className={styles.label}>
                    Wiadomość:
                    <textarea className={styles.textarea}></textarea>
                </label>
                <button type="submit" className={styles.button}>Wyślij</button>
            </motion.form>
        </div>
    );
}