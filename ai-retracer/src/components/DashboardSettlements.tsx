"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building, Layers, HelpCircle, CheckCircle2, ArrowRightLeft } from "lucide-react";
import styles from "./DashboardSettlements.module.css";
import { Settlement } from "./DashboardContainer";

interface SettlementsProps {
  settlements: Settlement[];
  liveMode: boolean;
}

export default function DashboardSettlements({ settlements, liveMode }: SettlementsProps) {
  // Format currency helper (INR)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculations
  const totalSettled = settlements
    .filter((s) => s.status === "settled")
    .reduce((sum, s) => sum + s.amount, 0);

  const pendingSettlement = settlements
    .filter((s) => s.status === "processed")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className={styles.settlementsContainer}>
      {/* Metric row */}
      <div className={styles.metricsGrid}>
        {/* Metric 1 */}
        <div className={`${styles.metricCard} glass`}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Total Settled</span>
            <CheckCircle2 size={18} className={styles.metricIcon} style={{ color: "var(--color-success)" }} />
          </div>
          <div className={styles.metricValue}>{formatCurrency(totalSettled)}</div>
          <div className={styles.metricSubtext}>Transferred successfully to bank accounts</div>
        </div>

        {/* Metric 2 */}
        <div className={`${styles.metricCard} glass`}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Pending Settlements</span>
            <Layers size={18} className={styles.metricIcon} style={{ color: "var(--color-primary)" }} />
          </div>
          <div className={styles.metricValue}>{formatCurrency(pendingSettlement)}</div>
          <div className={styles.metricSubtext}>Currently processing for next payout batch</div>
        </div>

        {/* Metric 3 */}
        <div className={`${styles.metricCard} glass`}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Next Payout</span>
            <ArrowRightLeft size={18} className={styles.metricIcon} style={{ color: "var(--color-accent)" }} />
          </div>
          <div className={styles.metricValue}>Daily, 06:00 AM</div>
          <div className={styles.metricSubtext}>T+1 rolling settlements enabled</div>
        </div>
      </div>

      {/* Split view: settlements table + timeline */}
      <div className={styles.splitGrid}>
        {/* Table list */}
        <div className={`${styles.tableCard} glass`}>
          <h2 className={styles.sectionTitle}>Settlement Ledger</h2>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.setlTable}>
              <thead>
                <tr>
                  <th className={styles.setlTh}>Settlement ID</th>
                  <th className={styles.setlTh}>Amount</th>
                  <th className={styles.setlTh}>Destination Bank</th>
                  <th className={styles.setlTh}>Status</th>
                  <th className={styles.setlTh}>Settled At</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((setl) => (
                  <tr key={setl.id}>
                    <td className={`${styles.setlTd} mono`} style={{ color: "var(--color-primary)", fontWeight: 650 }}>
                      {setl.id}
                    </td>
                    <td className={`${styles.setlTd} mono`} style={{ fontWeight: 600 }}>
                      {formatCurrency(setl.amount)}
                    </td>
                    <td className={styles.setlTd}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Building size={16} style={{ color: "var(--text-muted)" }} />
                        <span style={{ fontSize: "0.85rem" }}>
                          {setl.bankName} ({setl.accountNumber})
                        </span>
                      </div>
                    </td>
                    <td className={styles.setlTd}>
                      <span
                        className={`${styles.badge} ${
                          setl.status === "settled"
                            ? styles.badgeSettled
                            : setl.status === "processed"
                            ? styles.badgeProcessed
                            : styles.badgeFailed
                        }`}
                      >
                        {setl.status}
                      </span>
                    </td>
                    <td className={styles.setlTd} style={{ color: "var(--text-muted)", fontSize: "0.825rem" }}>
                      {setl.settledAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline guide */}
        <div className={`${styles.timelineCard} glass`}>
          <h2 className={styles.sectionTitle}>How Settlements Work</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineStep}>
              <span className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
              <span className={styles.timelineTitle}>1. Customer Pays</span>
              <span className={styles.timelineDesc}>
                Payment is captured in your Razorpay dashboard and goes to your escrow account.
              </span>
            </div>

            <div className={styles.timelineStep}>
              <span className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
              <span className={styles.timelineTitle}>2. Payout Processing</span>
              <span className={styles.timelineDesc}>
                Transactions are rolled up every midnight to prepare the daily transfer batch.
              </span>
            </div>

            <div className={styles.timelineStep}>
              <span className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
              <span className={styles.timelineTitle}>3. Bank Disbursal</span>
              <span className={styles.timelineDesc}>
                Funds are dispatched to your linked bank account via IMPS/NEFT by 6:00 AM daily.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
