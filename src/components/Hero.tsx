"use client";

import React from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={`${styles.heroContent} container`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>v1.0 Developer Preview</span>
        </div>
        
        <h1 className={`${styles.title} gradient-text`}>
          Trace, Replay, and Debug <br />
          <span className="gradient-accent-text">Production Failures</span> with AI
        </h1>
        
        <p className={styles.description}>
          Glide converts telemetry spans, database queries, and unstructured server logs into highly visual, step-by-step code execution replays. Stop guessing, trace exactly what happened.
        </p>
        
        <div className={styles.actions}>
          <button 
            onClick={() => {
              const el = document.getElementById("waitlist");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={styles.primaryBtn}
          >
            Join Private Beta
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById("demo");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={styles.secondaryBtn}
          >
            Watch Interactive Replay
          </button>
        </div>
      </div>

      {/* Visual Mockup Dashboard */}
      <div className={`${styles.mockupContainer} container`}>
        <div className={styles.mockup}>
          {/* Header */}
          <div className={styles.mockupHeader}>
            <div className={styles.mockupWindowControls}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={`${styles.dot} ${styles.dotGreen}`} />
            </div>
            
            <div className={styles.mockupTabs}>
              <span className={`${styles.tab} ${styles.tabActive}`}>Trace Visualizer</span>
              <span className={styles.tab}>Metrics</span>
              <span className={styles.tab}>Logs</span>
            </div>
            
            <div style={{ width: 48 }} /> {/* spacer */}
          </div>
          
          {/* Dashboard Body */}
          <div className={styles.mockupBody}>
            {/* Sidebar Spans */}
            <div className={styles.sidebar}>
              <span className={styles.sidebarTitle}>Active Spans</span>
              
              <div className={`${styles.spanItem} ${styles.spanActive}`}>
                <div className={styles.spanHeader}>
                  <span className={styles.spanName}>POST /checkout</span>
                  <span className={`${styles.spanStatus} ${styles.statusError}`}>500</span>
                </div>
                <div className={styles.spanMeta}>
                  <span>checkout-service</span>
                  <span>1.42s</span>
                </div>
              </div>

              <div className={styles.spanItem}>
                <div className={styles.spanHeader}>
                  <span className={styles.spanName}>GET /cart</span>
                  <span className={`${styles.spanStatus} ${styles.statusSuccess}`}>200</span>
                </div>
                <div className={styles.spanMeta}>
                  <span>cart-service</span>
                  <span>42ms</span>
                </div>
              </div>

              <div className={styles.spanItem}>
                <div className={styles.spanHeader}>
                  <span className={styles.spanName}>GET /inventory</span>
                  <span className={`${styles.spanStatus} ${styles.statusSuccess}`}>200</span>
                </div>
                <div className={styles.spanMeta}>
                  <span>inventory-service</span>
                  <span>108ms</span>
                </div>
              </div>
            </div>
            
            {/* Trace View */}
            <div className={styles.mainView}>
              <div className={styles.flowChart}>
                {/* Node 1 */}
                <div className={`${styles.node} ${styles.nodeActive}`}>
                  <div className={`${styles.nodeIcon} ${styles.iconPurple}`}>GW</div>
                  <div className={styles.nodeInfo}>
                    <span className={styles.nodeTitle}>API-Gateway (Ingress)</span>
                    <span className={styles.nodeSubtitle}>Route: /v1/checkout • HTTP 500</span>
                  </div>
                  <div className={`${styles.nodeConnector} ${styles.nodeConnectorActive}`} />
                </div>

                {/* Node 2 */}
                <div className={`${styles.node} ${styles.nodeActive}`}>
                  <div className={`${styles.nodeIcon} ${styles.iconCyan}`}>SRV</div>
                  <div className={styles.nodeInfo}>
                    <span className={styles.nodeTitle}>Checkout-Service-V2</span>
                    <span className={styles.nodeSubtitle}>Span ID: sp_849e3 • Controller::handleCheckout</span>
                  </div>
                  <div className={`${styles.nodeConnector} ${styles.nodeConnectorError}`} />
                </div>

                {/* Node 3 (Error Node) */}
                <div className={`${styles.node} ${styles.nodeError}`}>
                  <div className={`${styles.nodeIcon} ${styles.iconRed}`}>DB</div>
                  <div className={styles.nodeInfo}>
                    <span className={styles.nodeTitle}>postgres-primary (database)</span>
                    <span className={styles.nodeSubtitle}>Timeout: FATAL: remaining connection slots are reserved</span>
                  </div>
                </div>
              </div>
              
              {/* AI Insight Box */}
              <div className={styles.aiAnalysis}>
                <span className={styles.aiIcon}>✨</span>
                <div className={styles.aiText}>
                  <span>AI Root-Cause:</span> Retracer isolated a connection pool leak in <code>DB::establishConnection()</code> triggered on line <code>41</code>. Recommended fix: Wrap database clients in <code>try/finally</code> to ensure releases.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
