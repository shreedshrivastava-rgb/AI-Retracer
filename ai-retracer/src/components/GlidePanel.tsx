"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, X, AtSign, Mic, Activity } from "lucide-react";
import styles from "./GlidePanel.module.css";

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
    text: "Hi! I'm Glide, your Razorpay AI assistant. Ask me anything about your payments, settlements, or integrations.",
    time: "just now",
  },
];

const AI_RESPONSES: string[] = [
  "Your last 7-day payment volume is ₹1,88,950. Success rate stands at 94.2% — looking healthy!",
  "Settlement for ₹16,750 was processed to HDFC Bank (XXXXXXXX4321) at 6:00 AM today.",
  "You have 2 active payment links. The 'Consulting Fee - May' link has received 2 payments so far.",
  "To enable T+1 settlements, go to Developer API settings and toggle the fast-settlement option. I can walk you through it.",
  "No failed high-value transactions in the last 48 hours. Keep it up!",
];

interface GlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlidePanel({ isOpen, onClose }: GlidePanelProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);
  const [panelWidth, setPanelWidth] = useState(420);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI reply
    setTimeout(() => {
      const aiText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: aiText,
        time: getTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
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
              <div className={styles.messagesContainer}>
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
LTextAreaElement;
                    t.style.height = "auto";
                    t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                  }}
                />
                <div className={styles.inputActions}>
                  <button className={styles.inputActionBtn} title="Mention">
                    <AtSign size={15} />
                  </button>
                  <button
                    className={styles.inputActionBtn}
                    title="Voice"
                    onClick={() => setVoiceActive((v) => !v)}
                  >
                    <Mic size={15} style={{ color: voiceActive ? "var(--color-primary)" : undefined }} />
                  </button>
                  {/* Glowing send / voice button */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className={`${styles.voiceBtn} ${voiceActive ? styles.voiceBtnActive : ""}`}
                    onClick={input.trim() ? handleSend : () => setVoiceActive((v) => !v)}
                    title={input.trim() ? "Send" : "Voice mode"}
                  >
                    {input.trim() ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    ) : (
                      <Activity size={14} />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
             <Activity size={14} />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
