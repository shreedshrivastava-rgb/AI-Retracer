"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, HelpCircle } from "lucide-react";
import styles from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  liveMode: boolean;
  setLiveMode: (val: boolean) => void;
  activeTab: string;
}

export default function DashboardHeader({
  liveMode,
  setLiveMode,
  activeTab,
}: DashboardHeaderProps) {
  // Map tab keys to nice descriptive headings
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "overview":
        return "Dashboard Overview";
      case "transactions":
        return "Transactions & Payments";
      case "payment_links":
        return "Payment Links Creator";
      case "settlements":
        return "Bank Settlements";
      case "settings":
        return "Developer Settings";
      default:
        return tab;
    }
  };

  return (
    <header className={styles.header}>
      {/* Title & Section details */}
      <div className={styles.leftSection}>
        <h1 className={styles.title}>{getTabTitle(activeTab)}</h1>
      </div>

      {/* Center Search Bar */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search payments, links, refunds..."
          className={styles.searchInput}
        />
      </div>

      {/* Right Controls */}
      <div className={styles.rightSection}>
        {/* Live/Test Mode Toggle */}
        <div className={styles.modeToggleWrapper}>
          <span
            className={`${styles.modeLabel} ${
              liveMode ? styles.liveText : styles.testText
            }`}
          >
            <span
              className={`${styles.pulseDot} ${
                liveMode ? styles.pulseDotLive : styles.pulseDotTest
              }`}
            />
            {liveMode ? "Live Mode" : "Test Mode"}
          </span>
          <div
            className={`${styles.toggleSwitch} ${
              liveMode ? styles.toggleSwitchActive : ""
            }`}
            onClick={() => setLiveMode(!liveMode)}
          >
            <motion.div
              className={styles.toggleHandle}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                alignSelf: liveMode ? "flex-end" : "flex-start",
                marginLeft: liveMode ? "auto" : "0",
              }}
            />
          </div>
        </div>

        {/* FAQ Support */}
        <button className={styles.actionBtn} aria-label="Support Help">
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <button className={styles.actionBtn} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.notificationBadge} />
        </button>

        {/* Profile Avatar */}
        <div className={styles.profileAvatar} title="Shreed Shrivastava">
          SS
        </div>
      </div>
    </header>
  );
}
