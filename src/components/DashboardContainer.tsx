"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DashboardContainer.module.css";

// Lazy-loaded or modular component imports (stubs to prevent build crashes)
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardOverview from "./DashboardOverview";
import DashboardTransactions from "./DashboardTransactions";
import DashboardPaymentLinks from "./DashboardPaymentLinks";
import DashboardSettlements from "./DashboardSettlements";
import DashboardSettings from "./DashboardSettings";
import GlidePanel from "./GlidePanel";

// Type definitions
export interface Transaction {
  id: string;
  amount: number;
  status: "captured" | "failed" | "refunded";
  email: string;
  phone: string;
  method: "upi" | "card" | "netbanking";
  createdAt: string;
}

export interface PaymentLink {
  id: string;
  amount: number;
  purpose: string;
  status: "active" | "expired" | "paid";
  paymentsCount: number;
  createdAt: string;
}

export interface Settlement {
  id: string;
  amount: number;
  status: "settled" | "processed" | "failed";
  bankName: string;
  accountNumber: string;
  settledAt: string;
}

export default function DashboardContainer() {
  const [liveMode, setLiveMode] = useState<boolean>(false);
  const [glideOpen, setGlideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Mock Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "pay_N8x2k9J5aQ",
      amount: 12500.00,
      status: "captured",
      email: "shreed.shrivastava@glide.com",
      phone: "+91 99999 88888",
      method: "card",
      createdAt: "3 mins ago",
    },
    {
      id: "pay_K9j1a8P6eS",
      amount: 4250.00,
      status: "captured",
      email: "rahul.sharma@gmail.com",
      phone: "+91 98765 43210",
      method: "upi",
      createdAt: "25 mins ago",
    },
    {
      id: "pay_A3x8f4M9wK",
      amount: 18000.00,
      status: "failed",
      email: "preeti.singh@yahoo.com",
      phone: "+91 88888 77777",
      method: "upi",
      createdAt: "1 hour ago",
    },
    {
      id: "pay_F5k2m8X1qP",
      amount: 950.00,
      status: "refunded",
      email: "karan.johal@company.com",
      phone: "+91 77777 66666",
      method: "netbanking",
      createdAt: "3 hours ago",
    },
    {
      id: "pay_H9j0a7W4tY",
      amount: 2500.00,
      status: "captured",
      email: "anjali.mehta@live.com",
      phone: "+91 91234 56789",
      method: "upi",
      createdAt: "5 hours ago",
    },
    {
      id: "pay_Q4z7x3C2eW",
      amount: 150000.00,
      status: "captured",
      email: "finance@enterprise.com",
      phone: "+91 90000 11111",
      method: "card",
      createdAt: "1 day ago",
    },
    {
      id: "pay_L2k8p9O1iM",
      amount: 750.00,
      status: "captured",
      email: "customer.retail@outlook.com",
      phone: "+91 95555 44444",
      method: "upi",
      createdAt: "2 days ago",
    },
  ]);

  // Mock Payment Links State
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([
    {
      id: "plink_RzpL901X",
      amount: 4500.00,
      purpose: "Consulting Fee - May",
      status: "active",
      paymentsCount: 2,
      createdAt: "1 day ago",
    },
    {
      id: "plink_RzpA542Y",
      amount: 999.00,
      purpose: "Ebook Product Launch",
      status: "active",
      paymentsCount: 14,
      createdAt: "3 days ago",
    },
    {
      id: "plink_RzpE881Z",
      amount: 15000.00,
      purpose: "Advance Deposit",
      status: "expired",
      paymentsCount: 0,
      createdAt: "1 week ago",
    },
  ]);

  // Mock Settlements State
  const [settlements, setSettlements] = useState<Settlement[]>([
    {
      id: "setl_Hdfc9876A",
      amount: 16750.00,
      status: "settled",
      bankName: "HDFC BANK",
      accountNumber: "XXXXXXXX4321",
      settledAt: "Today, 06:00 AM",
    },
    {
      id: "setl_Icici5432B",
      amount: 152500.00,
      status: "settled",
      bankName: "ICICI BANK",
      accountNumber: "XXXXXXXX9012",
      settledAt: "Yesterday, 06:00 AM",
    },
    {
      id: "setl_Sbi11223C",
      amount: 2500.00,
      status: "processed",
      bankName: "STATE BANK OF INDIA",
      accountNumber: "XXXXXXXX1122",
      settledAt: "Processing...",
    },
  ]);

  // Webhook event list
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);

  // Function to add a payment link
  const createPaymentLink = (amount: number, purpose: string) => {
    const newLink: PaymentLink = {
      id: `plink_Rzp${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      amount,
      purpose,
      status: "active",
      paymentsCount: 0,
      createdAt: "Just now",
    };
    setPaymentLinks([newLink, ...paymentLinks]);
  };

  // Function to process a mock refund
  const refundTransaction = (id: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, status: "refunded" as const } : t))
    );
    // Add a log for webhooks
    triggerSimulatedWebhook("payment.refunded", { paymentId: id });
  };

  // Function to simulate a webhook payload
  const triggerSimulatedWebhook = (event: string, payload: any) => {
    const log = {
      id: `wh_${Math.random().toString(36).substring(2, 9)}`,
      event,
      timestamp: new Date().toLocaleTimeString(),
      payload: JSON.stringify({ event, data: payload, timestamp: Date.now() }, null, 2),
    };
    setWebhookLogs(prev => [log, ...prev].slice(0, 10)); // Keep last 10
  };

  // Map AI-suggested routes to dashboard tabs
  const handleNavigation = (route: string) => {
    const routeToTab: Record<string, string> = {
      "/dashboard": "overview",
      "/payments": "transactions",
      "/payment-links": "payment_links",
      "/settlements": "settlements",
      "/developer-api": "settings",
    };
    const tab = routeToTab[route];
    if (tab) {
      setActiveTab(tab);
    }
  };

  // Helper to render the active panel
  const renderPanel = () => {
    switch (activeTab) {
      case "overview":
        return (
          <DashboardOverview
            transactions={transactions}
            paymentLinks={paymentLinks}
            settlements={settlements}
            liveMode={liveMode}
          />
        );
      case "transactions":
        return (
          <DashboardTransactions
            transactions={transactions}
            onRefund={refundTransaction}
            liveMode={liveMode}
          />
        );
      case "payment_links":
        return (
          <DashboardPaymentLinks
            paymentLinks={paymentLinks}
            onCreateLink={createPaymentLink}
            liveMode={liveMode}
          />
        );
      case "settlements":
        return (
          <DashboardSettlements
            settlements={settlements}
            liveMode={liveMode}
          />
        );
      case "settings":
        return (
          <DashboardSettings
            apiKey={apiKey}
            setApiKey={setApiKey}
            webhookLogs={webhookLogs}
            onTriggerWebhook={triggerSimulatedWebhook}
            liveMode={liveMode}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <>
      <div className={styles.dashboardLayout}>
        {/* Liquid background blobs */}
        <div className="liquid-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
        </div>

        {/* Sidebar Navigation */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Workspace Area */}
        <div className={styles.mainWrapper}>
          <DashboardHeader
            liveMode={liveMode}
            setLiveMode={setLiveMode}
            activeTab={activeTab}
            glideOpen={glideOpen}
            setGlideOpen={setGlideOpen}
          />

          <main className={styles.contentContainer}>
            <div className={styles.contentInner}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className={styles.pageTransitionWrapper}
                >
                  {renderPanel()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Glide AI chat panel — portal sibling */}
      <GlidePanel isOpen={glideOpen} onClose={() => setGlideOpen(false)} onNavigate={handleNavigation} />
    </>
  );
}
