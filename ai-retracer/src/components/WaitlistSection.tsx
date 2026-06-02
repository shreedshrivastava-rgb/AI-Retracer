"use client";

import React, { useState } from "react";
import styles from "./WaitlistSection.module.css";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Mock successful database entry
    setIsSubmitted(true);
  };

  return (
    <section id="waitlist" className={styles.waitlistSection}>
      <div className={`${styles.card} glass container`}>
        {!isSubmitted ? (
          <div className={styles.content}>
            <h2 className={`${styles.title} gradient-text`}>
              Join the Private Beta
            </h2>
            <p className={styles.subtitle}>
              Accelerate your team’s debug loops. Get early developer preview access and experience visual execution path-tracing firsthand.
            </p>
            
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your work email"
                  className={styles.input}
                />
                {error && <p className={styles.errorMsg}>{error}</p>}
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                Request Invite
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.successWrapper}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>You&apos;re on the list!</h3>
            <p className={styles.successText}>
              Thank you for signing up for early developer access. We have reserved your spot and will reach out to <strong>{email}</strong> shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
