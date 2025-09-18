import Image from "next/image";
import styles from "./page.module.css";
import Navigation from "./navigation";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <h1 className={styles.title}>Witaj na <b>InvestiGenie</b></h1>
        <p className={styles.description}>
          Twoje narzędzie do inteligentnego inwestowania!
        </p>
      </main>
    </div>
  );
}
