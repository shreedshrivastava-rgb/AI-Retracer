"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, RotateCcw, AlertTriangle, CreditCard, Compass } from "lucide-react";
import styles from "./DashboardTransactions.module.css";
import { Transaction } from "./DashboardContainer";

interface TransactionsProps {
  transactions: Transaction[];
  onRefund: (id: string) => void;
  liveMode: boolean;
}

export default function DashboardTransactions({
  transactions,
  onRefund,
  liveMode,
}: TransactionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Format currency helper (INR)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Filter logic
  const filteredTx = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesMethod = methodFilter === "all" || tx.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Highlight detail drawer selected transaction updates (reactive sync)
  const currentSelectedTx = selectedTx
    ? transactions.find((t) => t.id === selectedTx.id) || selectedTx
    : null;

  return (
    <div className={styles.transactionsContainer}>
      {/* Search and Filters */}
      <div className={`${styles.tableCard} glass`}>
        <div className={styles.filterRow}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by ID, Email, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterControls}>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="all">All Statuses</option>
              <option value="captured">Captured</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>

            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Netbanking</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div style={{ overflowX: "auto" }}>
          <table className={styles.txTable}>
            <thead>
              <tr>
                <th className={styles.txTh}>Payment ID</th>
                <th className={styles.txTh}>Amount</th>
                <th className={styles.txTh}>Email</th>
                <th className={styles.txTh}>Method</th>
                <th className={styles.txTh}>Status</th>
                <th className={styles.txTh}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className={`${styles.txTr} ${
                      currentSelectedTx?.id === tx.id ? styles.txTrActive : ""
                    }`}
                  >
                    <td className={`${styles.txTd} mono`} style={{ color: "var(--color-primary)", fontWeight: 650 }}>
                      {tx.id}
                    </td>
                    <td className={`${styles.txTd} mono`} style={{ fontWeight: 600 }}>
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className={styles.txTd}>{tx.email}</td>
                    <td className={styles.txTd} style={{ textTransform: "uppercase" }}>
                      {tx.method}
                    </td>
                    <td className={styles.txTd}>
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
                    <td className={styles.txTd} style={{ color: "var(--text-muted)", fontSize: "0.825rem" }}>
                      {tx.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fly-out Detail Drawer Overlay */}
      <AnimatePresence>
        {currentSelectedTx && (
          <div className={styles.drawerOverlay} onClick={() => setSelectedTx(null)}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className={styles.drawer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerHeader}>
                <h3 className={styles.drawerTitle}>Payment Details</h3>
                <button onClick={() => setSelectedTx(null)} className={styles.closeBtn}>
                  <X size={18} />
                </button>
              </div>

              <div className={styles.drawerContent}>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Payment Amount</span>
                  <span className={styles.detailValuePrimary}>
                    {formatCurrency(currentSelectedTx.amount)}
                  </span>
                </div>

                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Payment ID</span>
                  <span className={`${styles.detailValue} mono`} style={{ color: "var(--color-primary)" }}>
                    {currentSelectedTx.id}
                  </span>
                </div>

                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Transaction Info</span>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailRowLabel}>Email</span>
                      <span className={styles.detailRowValue}>{currentSelectedTx.email}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailRowLabel}>Phone</span>
                      <span className={styles.detailRowValue}>{currentSelectedTx.phone}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailRowLabel}>Created At</span>
                      <span className={styles.detailRowValue}>{currentSelectedTx.createdAt}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailRowLabel}>Payment Method</span>
                      <span className={styles.detailRowValue} style={{ textTransform: "uppercase" }}>
                        {currentSelectedTx.method}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Technical Metadata</span>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailRowLabel}>Gateway ID</span>
                      <span className={`${styles.detailRowValue} mono`}>gw_RazorpayProdX</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailRowLabel}>Auth Code</span>
                      <span className={`${styles.detailRowValue} mono`}>auth_9920148</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailRowLabel}>Device Node</span>
                      <span className={styles.detailRowValue}>Chrome OS / Mobile-iOS</span>
                    </div>
                  </div>
                </div>

                {/* Refund CTA Button */}
                {currentSelectedTx.status === "captured" ? (
                  <button
                    onClick={() => onRefund(currentSelectedTx.id)}
                    className={styles.refundBtn}
                  >
                    <RotateCcw size={16} />
                    Refund Entire Amount
                  </button>
                ) : currentSelectedTx.status === "refunded" ? (
                  <div className={styles.refundedBanner}>
                    <AlertTriangle size={16} style={{ display: "inline", marginRight: "0.25rem", verticalAlign: "middle" }} />
                    This payment has been fully refunded
                  </div>
                ) : (
                  <div className={styles.refundedBanner} style={{ background: "rgba(244,63,94,0.08)", color: "var(--color-danger)", border: "1px solid rgba(244,63,94,0.15)" }}>
                    This payment failed at checkout
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
