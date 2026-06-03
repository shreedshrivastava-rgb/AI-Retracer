"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, X } from "lucide-react";
import styles from "./GlidePanel.module.css";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "ai",
    text: "Hi! I'm Glide Co-Pilot, your Razorpay Glide assistant. I'm here to help you manage your dashboard, track payments, or check your settlements. How can I help you today?",
    time: "just now",
  },
];

const AI_RESPONSES: string[] = [
  "Your total processing volume is ₹1,70,000, up 14.2% from last week. Everything looks solid!",
  "A settlement of ₹16,750 was just credited to your HDFC Bank account (XX4321).",
  "You have ₹2,50,000 in pending settlements, scheduled for payout at 06:00 AM tomorrow.",
  "The last transaction pay_N8x2k9J5aQ for ₹12,500 was successfully captured 3 minutes ago.",
  "I can take you to your API settings or help you create a new payment link. Just say the word!",
];

interface GlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlidePanel({ isOpen, onClose }: GlidePanelProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [panelWidth, setPanelWidth] = useState(420);
  const [lastRedirect, setLastRedirect] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Proactive Intent Handler
  const handleIntentDetected = (action: string, route: string) => {
    if (action === "REDIRECT" && route !== lastRedirect) {
      setLastRedirect(route);
      console.log(`[Glide Co-Pilot] Proactive Navigation Triggered: ${route}`);
      
      // Visual feedback in chat
      const navMsg: Message = {
        id: `nav-${Date.now()}`,
        role: "ai",
        text: `🚀 Proactively opening ${route.replace("/", "") || "dashboard"}...`,
        time: getTime(),
      };
      
      // Only add if not already the last message to avoid spamming
      setMessages((prev) => {
        if (prev[prev.length - 1]?.text === navMsg.text) return prev;
        return [...prev, navMsg];
      });

      // Here you would trigger actual frontend routing, e.g.:
      // router.push(route);
    }
  };

  const handleSend = async (text: string, files?: File[]) => {
    const trimmed = text.trim();
    if (!trimmed && (!files || files.length === 0)) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed || (files ? `Sent ${files.length} file(s)` : "Sent a file"),
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // AI BRAIN INTEGRATION PLACEHOLDER
    // const API_KEY = "YOUR_API_KEY_HERE";
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Simulate a structured JSON response from the "brain"
      // In a real implementation, this would come from an LLM call
      let aiResponseJson;
      const lowerText = trimmed.toLowerCase();
      
      if (lowerText.includes("count") && lowerText.includes("payment")) {
        aiResponseJson = {
          action: "REDIRECT",
          route: "/payments",
          spoken_response: "You've had 5 successful payments so far, up 8.3% from last week! I'm taking you to the transactions ledger now so you can see the details. Is there anything else I can help you with?",
        };
      } else if (lowerText.includes("settlement") || lowerText.includes("payout")) {
        aiResponseJson = {
          action: "TALK",
          route: null,
          spoken_response: "Your last settlement of ₹16,750 was credited to HDFC Bank (XX4321). You have ₹2,50,000 pending for tomorrow's payout. Would you like to see your full settlement history?",
        };
      } else if (lowerText.includes("volume") || lowerText.includes("business") || lowerText.includes("status")) {
        aiResponseJson = {
          action: "TALK",
          route: null,
          spoken_response: "Business is looking great! Your total processing volume is ₹1,70,000, which is a 14.2% increase over last week. Shall I help you create a new payment link to keep the momentum going?",
        };
      } else if (lowerText.includes("payment") || lowerText.includes("transaction")) {
        aiResponseJson = {
          action: "REDIRECT",
          route: "/payments",
          spoken_response: "Sure, let's take a look at your transactions. I'm redirecting you to the payments ledger now. Can I help with anything else while we're there?",
        };
      } else if (lowerText.includes("api") || lowerText.includes("webhook") || lowerText.includes("key")) {
        aiResponseJson = {
          action: "REDIRECT",
          route: "/developer-api",
          spoken_response: "Opening your developer tools. You can manage your API keys and webhooks here. Do you need help setting up a new webhook?",
        };
      } else {
        aiResponseJson = {
          action: "TALK",
          route: null,
          spoken_response: "I'm Glide Co-Pilot. I can help you with your settlements, track payments, or navigate the dashboard. What can I do for you today?",
        };
      }

      // 1. Handle Navigation if action is REDIRECT
      if (aiResponseJson.action === "REDIRECT" && aiResponseJson.route) {
        console.log(`[Glide Co-Pilot] Redirecting to: ${aiResponseJson.route}`);
        // Here you would trigger actual frontend routing, e.g.:
        // router.push(aiResponseJson.route);
      }

      // 2. Add spoken response to chat
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: aiResponseJson.spoken_response,
        time: getTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      
    } catch (error) {
      console.error("Glide Co-Pilot Error:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        text: "I'm having a bit of trouble connecting to my brain. Please try again in a moment.",
        time: getTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
  };

  // Mouse-drag resize logic
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: panelWidth };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = resizeRef.current.startX - ev.clientX;
      const newWidth = Math.max(320, Math.min(680, resizeRef.current.startWidth + delta));
      setPanelWidth(newWidth);
    };
    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop click to close */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.08)",
              zIndex: 200,
            }}
          />

          {/* Slide-in Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={styles.panel}
            style={{ width: panelWidth, position: "fixed", top: 0, right: 0, zIndex: 201 }}
          >
            {/* Drag-to-resize handle */}
            <div className={styles.resizeHandle} onMouseDown={onMouseDown} title="Drag to resize" />

            {/* Header */}
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                {/* Brand logo */}
                <img 
                  src="https://cdn.razorpay.com/logo.png" 
                  alt="Razorpay Logo" 
                  style={{ width: 24, height: 24, objectFit: "contain" }} 
                />
                New chat
              </span>
              <div className={styles.panelHeaderActions}>
                <button onClick={handleNewChat} className={styles.iconBtn} title="New chat">
                  <Plus size={17} />
                </button>
                <button className={styles.iconBtn} title="History">
                  <RotateCcw size={15} />
                </button>
                <button onClick={onClose} className={styles.iconBtn} title="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div className={styles.chatArea}>
              <div className={messages.length > 0 ? styles.messagesContainer : ""}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${styles.msgRow} ${msg.role === "user" ? styles.msgRowUser : ""}`}
                  >
                    <div
                      className={`${styles.msgAvatar} ${
                        msg.role === "user" ? styles.msgAvatarUser : ""
                      }`}
                    >
                      {msg.role === "ai" ? "G" : "SS"}
                    </div>
                    <div>
                      <div
                        className={`${styles.msgBubble} ${
                          msg.role === "ai" ? styles.msgBubbleAi : styles.msgBubbleUser
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={styles.msgTime}
                        style={{ textAlign: msg.role === "user" ? "right" : "left" }}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={styles.msgRow}
                    >
                      <div className={styles.msgAvatar}>G</div>
                      <div className={styles.typingIndicator}>
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div ref={chatEndRef} />
            </div>

            {/* Tip Banner */}
            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.tipBanner}
                >
                  <span className={styles.tipText}>
                    💡 Tip: Drag the left edge to resize the sidebar
                  </span>
                  <button onClick={() => setShowTip(false)} className={styles.tipClose}>
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            <div className={styles.inputArea}>
              <PromptInputBox 
                onSend={handleSend} 
                onIntentDetected={handleIntentDetected}
                isLoading={isTyping}
                placeholder="Ask Glide anything..."
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
