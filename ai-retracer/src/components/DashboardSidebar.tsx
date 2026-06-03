"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, CreditCard, Link2, Layers, Terminal } from "lucide-react";
import styles from "./DashboardSidebar.module.css";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab }: SidebarProps) {
  // Navigation Menu Options
  const menuItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "transactions", label: "Payments", icon: CreditCard },
    { id: "payment_links", label: "Payment Links", icon: Link2 },
    { id: "settlements", label: "Settlements", icon: Layers },
    { id: "settings", label: "Developer API", icon: Terminal },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand logo */}
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>R</div>
        <span className={styles.logoText}>
          razorpay <span style={{ fontWeight: 400, color: "var(--color-primary)" }}>x</span>
        </span>
      </div>

      {/* Navigation Headers */}
      <div className={styles.sectionHeader}>Business Suite</div>

      {/* Navigation list */}
      <ul className={styles.menuList}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <li key={item.id} className={styles.menuItemWrapper}>
              <button
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>

              {/* Framer motion active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={styles.activeIndicator}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer Info section */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span className={styles.merchantName}>Shreed Retracer</span>
          <span className={styles.merchantId}>MID: 1049582910</span>
        </div>
      </div>
    </aside>
  );
}
