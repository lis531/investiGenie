"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function GodContact() {
    const [response, setResponse] = useState<{ answer: boolean; message: string } | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const generateSeed = (text: string): number => {
        let hash = 0;
        if (text.length === 0) return hash;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const combinedText = `${formData.name}${formData.email}${formData.message}`;
        const seed = generateSeed(combinedText);
        const shouldInvest = seed % 2 === 0;
        
        const yesMessages = [
            "Gwiazdy są sprzyjające. Inwestuj śmiało!",
            "Widzę w przyszłości zyski. To dobry moment.",
            "Twoja intuicja Cię nie myli. Działaj!",
            "Finansowe błogosławieństwo na Cię czeka."
        ];
        
        const noMessages = [
            "Teraz nie jest czas. Czekaj na lepszy moment.",
            "Gwiazdy ostrzegają przed pochopnymi decyzjami.",
            "Twoje finanse potrzebują więcej przemyślenia.",
            "Cierpliwość przyniesie Ci większe korzyści."
        ];
        
        const messages = shouldInvest ? yesMessages : noMessages;
        const messageIndex = seed % messages.length;
        
        setResponse({
            answer: shouldInvest,
            message: messages[messageIndex]
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className={styles.page}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                <h1 className={styles.title}>Kontakt z Bogiem</h1>
                <p className={styles.description}>
                    Zapytaj Boga czy powinieneś inwestować. Otrzymasz mądrą odpowiedź.
                </p>
            </motion.div>
            
            <motion.form 
                className={styles.form} 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.4, delay: 0.2 }}
                onSubmit={handleSubmit}
            >
                <label className={styles.label}>
                    Imię:
                    <input 
                        type="text" 
                        name="name"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label className={styles.label}>
                    Email:
                    <input 
                        type="email" 
                        name="email"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label className={styles.label}>
                    Pytanie o inwestycję:
                    <textarea 
                        name="message"
                        className={styles.textarea}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Opisz swoją sytuację inwestycyjną..."
                        required
                    />
                </label>
                <button type="submit" className={styles.button}>Zapytaj Boga</button>
            </motion.form>

            {response && (
                <motion.div 
                    className={styles.response}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className={styles.responseTitle}>Odpowiedź od Boga:</div>
                    <div className={`${styles.responseAnswer} ${response.answer ? styles.responseYes : styles.responseNo}`}>
                        {response.answer ? "TAK" : "NIE"}
                    </div>
                    <div className={styles.responseMessage}>{response.message}</div>
                </motion.div>
            )}
        </div>
    );
}