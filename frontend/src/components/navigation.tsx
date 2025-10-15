"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./navigation.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({});
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !navRef.current) return;

    const activeIndex = getHighlightPosition();
    if (activeIndex === -1) return;

    const navItems = navRef.current.querySelectorAll('li');
    const activeItem = navItems[activeIndex];
    
    if (activeItem) {
      const { offsetLeft, offsetWidth } = activeItem;
      setHighlightStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [pathname, mounted]);

  const getHighlightPosition = () => {
    if (pathname === '/') return 0;
    if (pathname === '/features') return 1;
    if (pathname === '/contact_god') return 2;
    return -1;
  };

  return (
    <nav className={`${styles.nav} ${mounted ? styles.navVisible : ''}`}>
      <div className={styles.navContainer}>
        <ul className={styles.navList} ref={navRef}>
          <li className={`${styles.navItem} ${pathname === '/' ? styles.navItemActive : ''}`}>
            <Link href="/" className={styles.navLink}>Strona Główna</Link>
          </li>
          <li className={`${styles.navItem} ${pathname === '/features' ? styles.navItemActive : ''}`}>
            <Link href="/features" className={styles.navLink}>Funkcje</Link>
          </li>
          <li className={`${styles.navItem} ${pathname === '/contact_god' ? styles.navItemActive : ''}`}>
            <Link href="/contact_god" className={styles.navLink}>Kontakt z Bogiem</Link>
          </li>
        </ul>
        {getHighlightPosition() >= 0 && (
          <div 
            className={styles.highlight} 
            style={
              {
                '--highlight-left': `${(highlightStyle as any).left || 0}px`,
                '--highlight-width': `${(highlightStyle as any).width || 0}px`
              } as React.CSSProperties
            }
          />
        )}
      </div>
    </nav>
  );
}