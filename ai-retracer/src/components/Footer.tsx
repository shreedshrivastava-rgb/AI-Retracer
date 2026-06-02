"use client";

import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.grid} container`}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <span className={styles.logoDot} />
            <span className="gradient-text">AI Retracer</span>
          </div>
          <p className={styles.tagline}>
            Connecting telemetry telemetry traces to source code line-by-line using artificial intelligence.
          </p>
          <span className={styles.complianceBadge}>
            🛡️ SOC2 Type II Certified
          </span>
        </div>

        {/* Links Column 1 */}
        <div className={styles.linksCol}>
          <span className={styles.colTitle}>Product</span>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}>
              <a href="#features">Features</a>
            </li>
            <li className={styles.linkItem}>
              <a href="#demo">Interactive Demo</a>
            </li>
            <li className={styles.linkItem}>
              <a href="#waitlist">Waitlist</a>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className={styles.linksCol}>
          <span className={styles.colTitle}>Integrations</span>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                OpenTelemetry
              </a>
            </li>
            <li className={styles.linkItem}>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub Provider
              </a>
            </li>
            <li className={styles.linkItem}>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                VS Code Extension
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`${styles.bottomBar} container`}>
        <span>
          © {new Date().getFullYear()} AI Retracer Inc. All rights reserved.
        </span>
        <div className={styles.socials}>
          <a href="https://github.com/shreedshrivastava-rgb" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            Security Policy
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
