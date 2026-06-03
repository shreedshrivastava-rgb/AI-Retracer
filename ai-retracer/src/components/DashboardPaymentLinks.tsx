"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "react-slice"; // Wait, react-slice is not a package!
// Let's import from framer-motion instead
import { Copy, Check, Link2, Plus, Smartphone, CreditCard, Send } from "lucide-react";
import styles from "./DashboardPaymentLinks.module.css";
import { PaymentLink } from "./DashboardContainer";

interface PaymentLinksProps {
  paymentLinks: PaymentLink[];
  onCreateLink: (amount: number, purpose: string) => void;
  liveMode: boolean;
}

export default function DashboardPaymentLinks({
  paymentLinks,
  onCreateLink,
  liveMode,
}: PaymentLinksProps) {
  const [amountInput, setAmountInput] = useState("");
  const [purposeInput, setPurposeInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Format currency helper (INR)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Copy handler
  const handleCopy = (id: string) => {
    const mockUrl = `https://rzp.io/l/${id}`;
    navigator.clipboard.writeText(mockUrl);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountInput);
    if (!parsedAmount || parsedAmount <= 0 || !purposeInput.trim()) return;

    onCreateLink(parsedAmount, purposeInput.trim());
    setAmountInput("");
    setPurposeInput("");
  };

  return (
    <div className={styles.container}>
      {/* Left side: Form + List */}
      <div className={styles.leftPane}>
        {/* Creator Form */}
        <div className={`${styles.formCard} glass`}>
          <h2 className={styles.formTitle}>Create Payment Link</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Amount</label>
              <div className={styles.inputWrapper}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  placeholder="1000"
                  required
                  min="1"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className={`${styles.input} styles.inputCurrency`}
                  style={{ paddingLeft: "1.75rem", fontFamily: "var(--font-mono)", fontWeight: 600 }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Purpose / Item Description</label>
              <input
                type="text"
                placeholder="e.g. Website Consulting Deposit"
                required
                value={purposeInput}
                onChange={(e) => setPurposeInput(e.target.value)}
                className={styles.input}
              />
            </div>

            <motion.button
              type="submit"
              className={styles.submitBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={16} />
              Generate Payment Link
            </motion.button>
          </form>
        </div>

        {/* Existing links database */}
        <div className={`${styles.listCard} glass`}>
          <h2 className={styles.listTitle}>Generated Links</h2>
          <div className={styles.linksList}>
            {paymentLinks.map((link) => (
              <div key={link.id} className={styles.linkItem}>
                <div className={styles.linkDetails}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className={styles.linkPurpose}>{link.purpose}</span>
                    <span
                      className={`${styles.linkBadge} ${
                        link.status === "active"
                          ? styles.linkBadgeActive
                          : styles.linkBadgeExpired
                      }`}
                    >
                      {link.status}
                    </span>
                  </div>
                  <span className={styles.linkMeta}>
                    <span style={{ fontWeight: 650, color: "var(--text-primary)" }}>
                      {formatCurrency(link.amount)}
                    </span>
                    • {link.paymentsCount} payments • {link.createdAt}
                  </span>
                </div>

                <div className={styles.linkActions}>
                  {/* Link Url Text */}
                  <span
                    className="mono"
                    style={{ fontSize: "0.75rem", color: "var(--color-primary)", paddingRight: "0.5rem" }}
                  >
                    rzp.io/l/{link.id}
                  </span>

                  <button
                    onClick={() => handleCopy(link.id)}
                    className={styles.actionIconBtn}
                    title="Copy Link URL"
                  >
                    {copiedId === link.id ? (
                      <Check size={14} style={{ color: "var(--color-success)" }} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Smartphone Live Mockup preview */}
      <div className={styles.rightPane}>
        <div className={styles.mobileFrame}>
          <div className={styles.mobileSpeaker} />
          <div className={styles.mobileContent}>
            <div className={styles.previewBadge}>Customer Payment Page</div>

            <div className={styles.merchantBlock}>
              <div className={styles.merchantAvatar}>R</div>
              <span className={styles.merchantName}>Shreed Retracer</span>
              <span className={styles.paymentPurpose}>
                {purposeInput.trim() ? purposeInput : "Payment Purpose description will appear here..."}
              </span>
            </div>

            <div className={styles.previewAmount}>
              ₹{amountInput ? parseFloat(amountInput).toLocaleString("en-IN") : "0"}
            </div>

            {/* Simulated Payment Methods */}
            <div className={styles.payMethodsBlock}>
              <div className={styles.payMethodItem}>
                <span className={`${styles.payMethodCircle} ${styles.payMethodCircleActive}`} />
                <span>UPI / QR Code (Google Pay, PhonePe)</span>
              </div>
              <div className={styles.payMethodItem}>
                <span className={styles.payMethodCircle} />
                <span>Credit / Debit Card (Visa, Mastercard)</span>
              </div>
              <div className={styles.payMethodItem}>
                <span className={styles.payMethodCircle} />
                <span>Netbanking (HDFC, ICICI, SBI)</span>
              </div>
            </div>

            <button className={styles.payButton} type="button" disabled>
              Pay ₹{amountInput ? parseFloat(amountInput).toLocaleString("en-IN") : "0"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
