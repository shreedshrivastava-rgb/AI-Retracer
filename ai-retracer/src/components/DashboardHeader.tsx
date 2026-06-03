"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, HelpCircle } from "lucide-react";
import styles from "./DashboardHeader.module.css";
import glideStyles from "./GlidePanel.module.css";

interface DashboardHeaderProps {
  liveMode: boolean;
  setLiveMode: (val: boolean) => void;
  activeTab: string;
  glideOpen: boolean;
  setGlideOpen: (val: boolean) => void;
}

export default function DashboardHeader({
  liveMode,
  setLiveMode,
  activeTab,
  glideOpen,
  setGlideOpen,
}: DashboardHeaderProps) {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "overview":      return "Dashboard Overview";
      case "transactions":  return "Transactions & Payments";
      case "payment_links": return "Payment Links Creator";
      case "settlements":   return "Bank Settlements";
      case "settings":      return "Developer Settings";
      default:              return tab;
    }
  };

  return (
    <header className={styles.header}>
      {/* Left: Section title */}
      <div className={styles.leftSection}>
        <h1 className={styles.title}>{getTabTitle(activeTab)}</h1>
      </div>

      {/* Center: Search */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search payments, links, refunds..."
          className={styles.searchInput}
        />
      </div>

      {/* Right: Controls */}
      <div className={styles.rightSection}>
        {/* Live/Test Toggle */}
        <div className={styles.modeToggleWrapper}>
          <span className={`${styles.modeLabel} ${liveMode ? styles.liveText : styles.testText}`}>
            <span className={`${styles.pulseDot} ${liveMode ? styles.pulseDotLive : styles.pulseDotTest}`} />
            {liveMode ? "Live Mode" : "Test Mode"}
          </span>
          <div
            className={`${styles.toggleSwitch} ${liveMode ? styles.toggleSwitchActive : ""}`}
            onClick={() => setLiveMode(!liveMode)}
          >
            <motion.div
              className={styles.toggleHandle}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ alignSelf: liveMode ? "flex-end" : "flex-start", marginLeft: liveMode ? "auto" : "0" }}
            />
          </div>
        </div>

        {/* ── Razorpay Glide Button ── */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setGlideOpen(!glideOpen)}
          className={`${glideStyles.glideButton} ${glideOpen ? glideStyles.glideButtonActive : ""}`}
          aria-label="Open Glide AI assistant"
        >
          {/* Razorpay logo mark */}
          <span className={glideStyles.razorpayLogo}>
            <svg width="18" height="18" viewBox="0 0 255 285" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Dark navy bar */}
              <path d="M55 0 L93 0 L30 285 L0 285 Z" fill="#072554" />
              {/* Bright blue arrow + body */}
              <path d="M93 0 L255 0 L163 100 L207 100 L128 285 L90 285 L163 105 L115 105 Z" fill="#3395FF" />
            </svg>
          </span>
          <span className={glideStyles.glideLabel}>Glide</span>
        </motion.button>

        {/* Help */}
        <button className={styles.actionBtn} aria-label="Support Help">
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <button className={styles.actionBtn} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.notificationBadge} />
        </button>

        {/* Avatar */}
        <div className={styles.profileAvatar} title="Shreed Shrivastava">
          SS
        </div>
      </div>
    </header>
  );
}
