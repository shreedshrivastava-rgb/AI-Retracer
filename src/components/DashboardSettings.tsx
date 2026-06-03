"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Copy, Check, Trash2, Webhook, Play } from "lucide-react";
import styles from "./DashboardSettings.module.css";

interface SettingsProps {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  webhookLogs: any[];
  onTriggerWebhook: (event: string, payload: any) => void;
  liveMode: boolean;
}

export default function DashboardSettings({
  apiKey,
  setApiKey,
  webhookLogs,
  onTriggerWebhook,
  liveMode,
}: SettingsProps) {
  const [copied, setCopied] = useState(false);

  // Generate key handler
  const handleGenerateKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 18);
    const keyPrefix = liveMode ? "rzp_live_" : "rzp_test_";
    setApiKey(`${keyPrefix}${randomHex}`);
  };

  // Copy key to clipboard
  const handleCopyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Revoke API key
  const handleRevokeKey = () => {
    if (confirm("Are you sure you want to revoke this API key? Any active server requests using this key will immediately fail.")) {
      setApiKey(null);
    }
  };

  // Simulate custom webhook events
  const handleSimulateWebhook = (event: string) => {
    let mockPayload = {};
    if (event === "payment.captured") {
      mockPayload = {
        paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
        amount: 2500,
        currency: "INR",
        email: "merchant.customer@example.com",
      };
    } else if (event === "payment.failed") {
      mockPayload = {
        paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
        amount: 9900,
        error_code: "BAD_REQUEST_CARD_EXPIRED",
        error_description: "The card has expired. Please try another card.",
      };
    } else {
      mockPayload = {
        refundId: `rfnd_${Math.random().toString(36).substring(2, 12)}`,
        paymentId: "pay_N8x2k9J5aQ",
        amount: 12500,
      };
    }
    onTriggerWebhook(event, mockPayload);
  };

  return (
    <div className={styles.settingsContainer}>
      {/* API Keys card */}
      <div className={`${styles.settingsCard} glass`}>
        <h2 className={styles.sectionTitle}>API Credentials</h2>
        <p className={styles.sectionDesc}>
          Use credentials to authenticate API calls from your application servers. Never expose your secret keys in public code bases.
        </p>

        {apiKey ? (
          <div>
            <div className={styles.apiKeyBlock}>
              <span className={styles.keyLabel}>{liveMode ? "Live API Secret Key" : "Test API Secret Key"}</span>
              <div className={styles.keyValueRow}>
                <span className={styles.keyValue}>{apiKey}</span>
                <button onClick={handleCopyKey} className={styles.actionIconBtn} style={{ border: "none" }} title="Copy to Clipboard">
                  {copied ? (
                    <Check size={16} style={{ color: "var(--color-success)" }} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={handleRevokeKey} className={`${styles.actionBtn} ${styles.btnDanger}`} style={{ flex: 1 }}>
                <Trash2 size={16} />
                Revoke Credentials
              </button>
            </div>
          </div>
        ) : (
          <div style={{ margin: "auto 0", textAlign: "center", padding: "2rem 0" }}>
            <Key size={36} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              No API Keys have been generated yet for this account mode.
            </p>
            <button onClick={handleGenerateKey} className={`${styles.actionBtn} ${styles.btnPrimary}`} style={{ margin: "0 auto", padding: "0 1.5rem" }}>
              <Key size={16} />
              Generate API Secret Key
            </button>
          </div>
        )}
      </div>

      {/* Webhook log simulator */}
      <div className={`${styles.settingsCard} glass`}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Webhook size={20} style={{ color: "var(--color-primary)" }} />
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Webhook Simulator</h2>
        </div>
        <p className={styles.sectionDesc}>
          Simulate server-side webhooks to test your server callback integrations and verify logging events.
        </p>

        {/* Action simulators */}
        <div className={styles.simulatorControls}>
          <button onClick={() => handleSimulateWebhook("payment.captured")} className={styles.simBtn}>
            <Play size={12} style={{ display: "inline", marginRight: "0.25rem" }} />
            payment.captured
          </button>
          <button onClick={() => handleSimulateWebhook("payment.failed")} className={styles.simBtn}>
            <Play size={12} style={{ display: "inline", marginRight: "0.25rem" }} />
            payment.failed
          </button>
          <button onClick={() => handleSimulateWebhook("payment.refunded")} className={styles.simBtn}>
            <Play size={12} style={{ display: "inline", marginRight: "0.25rem" }} />
            payment.refunded
          </button>
        </div>

        {/* Payload console */}
        <h3 className={styles.label} style={{ marginBottom: "0.75rem" }}>Simulated Event Payload Log</h3>
        <div className={styles.logsContainer}>
          {webhookLogs.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(0,0,0,0.08)", borderRadius: 10, padding: "2rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
              Log is empty. Trigger an event above to inspect live JSON payload console.
            </div>
          ) : (
            <AnimatePresence>
              {webhookLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div className={styles.logHeader}>
                    <span className={styles.logEventName}>{log.event}</span>
                    <span className={styles.logTimestamp}>{log.timestamp}</span>
                  </div>
                  <pre className={styles.codeBlock}>{log.payload}</pre>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
