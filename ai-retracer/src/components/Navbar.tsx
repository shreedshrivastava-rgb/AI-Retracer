"use client";

import React from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.logo}>
        <img 
          src="https://cdn.razorpay.com/logo.png" 
          alt="Razorpay Logo" 
          className={styles.logoImg} 
        />
        <span className="gradient-text">Glide</span>
      </div>
      
      <ul className={styles.navLinks}>
        <li>
          <a href="#features" className={styles.navLink}>
            Features
          </a>
        </li>
        <li>
          <a href="#demo" className={styles.navLink}>
            Interactive Demo
          </a>
        </li>
        <li>
          <a href="#waitlist" className={styles.navLink}>
            Join Waitlist
          </a>
        </li>
      </ul>
      
      <button 
        onClick={() => {
          const el = document.getElementById("waitlist");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className={styles.ctaBtn}
      >
        Request Access
      </button>
    </nav>
  );
}
