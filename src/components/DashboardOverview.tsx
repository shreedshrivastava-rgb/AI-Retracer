"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CreditCard,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import styles from "./DashboardOverview.module.css";
import { Transaction, PaymentLink, Settlement } from "./DashboardContainer";

interface OverviewProps {
  transactions: Transaction[];
  paymentLinks: PaymentLink[];
  settlements: Settlement[];
  liveMode: boolean;
}

export default function DashboardOverview({
  transactions,
  paymentLinks,
  settlements,
  liveMode,
}: OverviewProps) {
  const [chartTimeframe, setChartTimeframe] = useState<string>("7d");

  // Format currency helper (INR)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculations based on actual transactions
  const totalVolume = transactions
    .filter((t) => t.status === "captured")
    .reduce((sum, t) => sum + t.amount, 0);

  const paymentsCount = transactions.filter((t) => t.status === "captured").length;

  const refundsVolume = transactions
    .filter((t) => t.status === "refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  // Settlement calculations
  const settledVolume = settlements
    .filter((s) => s.status === "settled")
    .reduce((sum, s) => sum + s.amount, 0);

  // Recent transactions list (first 3)
  const recentTx = transactions.slice(0, 3);

  // Chart data definitions for SVG drawing (100% responsive points)
  const getChartPoints = () => {
    // Return SVG coordinate path values for different timeframes
    if (chartTimeframe === "24h") {
      return {
        line: "M 0 160 Q 100 80 200 130 T 400 40 T 600 90 T 800 30 T 1000 60",
        fill: "M 0 160 Q 100 80 200 130 T 400 40 T 600 90 T 800 30 T 1000 60 L 1000 220 L 0 220 Z",
      };
    }
    if (chartTimeframe === "30d") {
      return {
        line: "M 0 180 C 150 140, 200 60, 350 100 C 500 140, 650 30, 800 70 T 1000 20",
        fill: "M 0 180 C 150 140, 200 60, 350 100 C 500 140, 650 30, 800 70 T 1000 20 L 1000 220 L 0 220 Z",
      };
    }
    // Default 7d
    return {
      line: "M 0 140 C 100 160, 200 40, 350 90 C 500 140, 650 50, 800 110 T 1000 50",
      fill: "M 0 140 C 100 160, 200 40, 350 90 C 500 140, 650 50, 800 110 T 1000 50 L 1000 220 L 0 220 Z",
    };
  };

  const activePath = getChartPoints();

  return (
    <div className={styles.overviewContainer}>
      {/* Top metrics card row */}
      <div className={styles.metricsGrid}>
        {/* Metric 1 */}
        <motion.div
          className={`${styles.metricCard} glass glass-interactive`}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Total Volume</span>
            <TrendingUp size={18} className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{formatCurrency(totalVolume)}</div>
          <div className={styles.metricSubtext}>
            <span className={styles.trendUp}>
              <ArrowUpRight size={14} style={{ display: "inline", verticalAlign: "middle" }} /> +14.2%
            </span>
            vs last week
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          className={`${styles.metricCard} glass glass-interactive`}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Payments Count</span>
            <CreditCard size={18} className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{paymentsCount}</div>
          <div className={styles.metricSubtext}>
            <span className={styles.trendUp}>
              <ArrowUpRight size={14} style={{ display: "inline", verticalAlign: "middle" }} /> +8.3%
            </span>
            vs last week
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div
          className={`${styles.metricCard} glass glass-interactive`}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Refunds Volume</span>
            <RefreshCw size={18} className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{formatCurrency(refundsVolume)}</div>
          <div className={styles.metricSubtext}>
            <span className={styles.trendDown}>
              <ArrowDownRight size={14} style={{ display: "inline", verticalAlign: "middle" }} /> -2.5%
            </span>
            vs last week
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div
          className={`${styles.metricCard} glass glass-interactive`}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Settled Payouts</span>
            <Clock size={18} className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{formatCurrency(settledVolume)}</div>
          <div className={styles.metricSubtext}>
            <ShieldCheck size={14} className={styles.trendUp} />
            Automated settlement
          </div>
        </motion.div>
      </div>

      {/* Main chart and bank payout split */}
      <div className={styles.mainGrid}>
        {/* SVG chart box */}
        <div className={`${styles.chartCard} glass`}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Transaction Volume Trends</h2>
            <div className={styles.chartTabs}>
              {["24h", "7d", "30d"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`${styles.chartTabButton} ${
                    chartTimeframe === tf ? styles.chartTabButtonActive : ""
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.chartCanvasWrapper}>
            {/* SVG Chart Graphic */}
            <svg
              viewBox="0 0 1000 220"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(82, 142, 253, 0.45)" />
                  <stop offset="100%" stopColor="rgba(82, 142, 253, 0)" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="50%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="55" x2="1000" y2="55" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
              <line x1="0" y1="110" x2="1000" y2="110" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
              <line x1="0" y1="165" x2="1000" y2="165" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />

              {/* Area Fill */}
              <motion.path
                d={activePath.fill}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Stroke Line */}
              <motion.path
                d={activePath.line}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>

        {/* Bank payout steps */}
        <div className={`${styles.settlementCard} glass`}>
          <div>
            <div className={styles.settlementHeader}>
              <div className={styles.settlementIconWrapper}>
                <Building size={20} />
              </div>
              <div className={styles.settlementBankInfo}>
                <span className={styles.bankName}>HDFC BANK Payout</span>
                <span className={styles.bankDetails}>A/C XXXXXXXX4321</span>
              </div>
            </div>

            <div className={styles.settlementAmount}>{formatCurrency(16750)}</div>
            <div className={styles.settlementStatusGlow}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-success)",
                  boxShadow: "0 0 10px var(--color-success)",
                }}
              />
              Settlement Credited
            </div>
          </div>

          {/* Timeline tracker */}
          <div className={styles.timeline}>
            <div className={styles.timelineStep}>
              <span className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
              <span className={`${styles.timelineStepTitle} ${styles.timelineStepTitleActive}`}>
                Payments Authorized
              </span>
              <span className={styles.timelineStepDesc}>Today, 12:45 AM</span>
            </div>
            <div className={styles.timelineStep}>
              <span className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
              <span className={`${styles.timelineStepTitle} ${styles.timelineStepTitleActive}`}>
                Settlement Processed
              </span>
              <span className={styles.timelineStepDesc}>Today, 04:30 AM</span>
            </div>
            <div className={styles.timelineStep}>
              <span className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
              <span className={`${styles.timelineStepTitle} ${styles.timelineStepTitleActive}`}>
                Funds Transferred to Bank
              </span>
              <span className={styles.timelineStepDesc}>Today, 06:00 AM (HDFC Bank)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ledger table */}
      <div className={`${styles.recentSection} glass`}>
        <div className={styles.recentHeader}>
          <h2 className={styles.recentTitle}>Recent Transactions</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.recentTable}>
            <thead>
              <tr>
                <th className={styles.recentTh}>Payment ID</th>
                <th className={styles.recentTh}>Amount</th>
                <th className={styles.recentTh}>Email</th>
                <th className={styles.recentTh}>Method</th>
                <th className={styles.recentTh}>Status</th>
                <th className={styles.recentTh}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} className={styles.recentTr}>
                  <td className={`${styles.recentTd} mono`} style={{ color: "var(--color-primary)", fontWeight: 650 }}>
                    {tx.id}
                  </td>
                  <td className={`${styles.recentTd} mono`} style={{ fontWeight: 600 }}>
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className={styles.recentTd}>{tx.email}</td>
                  <td className={styles.recentTd} style={{ textTransform: "uppercase" }}>{tx.method}</td>
                  <td className={styles.recentTd}>
                    <span
                      className={`${styles.badge} ${
                        tx.status === "captured"
                          ? styles.badgeCaptured
                          : tx.status === "refunded"
                          ? styles.badgeRefunded
                          : styles.badgeFailed
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className={styles.recentTd} style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {tx.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
