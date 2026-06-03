"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./VisualTraceDemo.module.css";

interface BugStep {
  name: string;
  description: string;
  highlightLines: number[];
  status: "pending" | "running" | "failed";
}

interface BugScenario {
  title: string;
  filename: string;
  codeLines: string[];
  steps: BugStep[];
  aiInsight: string;
}

const BUGS: BugScenario[] = [
  {
    title: "Redis Connection Drop",
    filename: "redis_store.ts",
    codeLines: [
      `import redis from "redis";`,
      `const client = redis.createClient();`,
      `export async function getCachedUser(userId: string) {`,
      `  const key = \`user:\${userId}\`;`,
      `  const raw = await client.get(key);`,
      `  if (raw) return JSON.parse(raw);`,
      `  const user = await db.fetchUser(userId);`,
      `  await client.setex(key, 3600, JSON.stringify(user));`,
      `  return user;`,
      `}`
    ],
    steps: [
      {
        name: "Invoke Function",
        description: "Call to getCachedUser(\"usr_94a3b\") initiated.",
        highlightLines: [3],
        status: "running"
      },
      {
        name: "Check Redis Cache",
        description: "client.get(\"user:usr_94a3b\") returned NULL.",
        highlightLines: [5],
        status: "running"
      },
      {
        name: "Database Fallback",
        description: "Successfully fetched user object from Postgres DB.",
        highlightLines: [7],
        status: "running"
      },
      {
        name: "Write Cache Entry",
        description: "FATAL: Redis connection lost during write command.",
        highlightLines: [8],
        status: "failed"
      }
    ],
    aiInsight: "Redis cache write failed at line <code>8</code> due to connection drop. <span>Recommendation:</span> Wrap the Redis <code>setex</code> operation in a <code>try/catch</code> block to ensure cache-miss failures do not crash the primary user path (graceful degradation)."
  },
  {
    title: "Stripe Signature Failure",
    filename: "stripe_webhook.ts",
    codeLines: [
      `import stripe from "stripe";`,
      `export async function verifyWebhook(req: Request) {`,
      `  const sig = req.headers.get("stripe-signature");`,
      `  const payload = await req.text();`,
      `  let event;`,
      `  try {`,
      `    event = stripe.webhooks.constructEvent(`,
      `      payload, sig, process.env.STRIPE_KEY`,
      `    );`,
      `  } catch (err) {`,
      `    throw new Error("Invalid signature");`,
      `  }`,
      `  return event;`,
      `}`
    ],
    steps: [
      {
        name: "Receive Webhook",
        description: "Webhook event POST request accepted by API controller.",
        highlightLines: [2],
        status: "running"
      },
      {
        name: "Parse Signature",
        description: "Extracted signature token and read raw payload stream.",
        highlightLines: [3, 4],
        status: "running"
      },
      {
        name: "Reconstruct Event",
        description: "Initiated Stripe event cryptographic verification.",
        highlightLines: [7, 8, 9],
        status: "running"
      },
      {
        name: "Validation Caught",
        description: "Error: Webhook signature validation failed.",
        highlightLines: [11],
        status: "failed"
      }
    ],
    aiInsight: "Signature decryption failed at line <code>11</code>. The method expected <code>STRIPE_WEBHOOK_SECRET</code> but used <code>STRIPE_KEY</code> (API Key) which is invalid for signing. <span>Recommendation:</span> Update your environment bindings."
  },
  {
    title: "SQL N+1 Query Leak",
    filename: "timeline.ts",
    codeLines: [
      `export async function getTimeline(userId: string) {`,
      `  const posts = await db.query("SELECT * FROM posts LIMIT 10");`,
      `  const enriched = [];`,
      `  for (const post of posts) {`,
      `    const user = await db.query(`,
      `      "SELECT * FROM users WHERE id = $1", [post.authorId]`,
      `    );`,
      `    enriched.push({ ...post, author: user[0] });`,
      `  }`,
      `  return enriched;`,
      `}`
    ],
    steps: [
      {
        name: "Request Feed",
        description: "User triggered dashboard timeline construction.",
        highlightLines: [1],
        status: "running"
      },
      {
        name: "Fetch Posts",
        description: "Loaded 10 core timeline post objects from DB.",
        highlightLines: [2],
        status: "running"
      },
      {
        name: "N+1 Loop Cycle",
        description: "Executing repetitive queries inside posts loops.",
        highlightLines: [4, 5, 6, 7],
        status: "running"
      },
      {
        name: "DB Pool Timeout",
        description: "FATAL: Postgres pool exhausted (10 redundant user queries).",
        highlightLines: [6],
        status: "failed"
      }
    ],
    aiInsight: "Detected SQL N+1 query loop on line <code>5</code>. This causes a massive performance bottleneck and eventually crashes pool capacity. <span>Recommendation:</span> Reconstruct query to perform a single <code>JOIN</code> or <code>IN</code> operation."
  }
];

export default function VisualTraceDemo() {
  const [selectedBugIndex, setSelectedBugIndex] = useState(0);
  const [step, setStep] = useState(-1);
  const [isReplaying, setIsReplaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = BUGS[selectedBugIndex];

  // Reset when bug scenario changes
  useEffect(() => {
    resetDemo();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedBugIndex]);

  const resetDemo = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep(-1);
    setIsReplaying(false);
  };

  const startReplay = () => {
    resetDemo();
    setIsReplaying(true);
    setStep(0);

    let currentStep = 0;
    timerRef.current = setInterval(() => {
      currentStep += 1;
      if (currentStep < scenario.steps.length) {
        setStep(currentStep);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsReplaying(false);
      }
    }, 1800); // 1.8 seconds per trace step
  };

  // Helper to determine if a line is currently highlighted
  const getLineClass = (lineNum: number) => {
    if (step === -1) return "";
    
    const currentStepConfig = scenario.steps[step];
    const isHighlighted = currentStepConfig.highlightLines.includes(lineNum);
    
    if (isHighlighted) {
      return currentStepConfig.status === "failed" 
        ? styles.lineError 
        : styles.lineHighlighted;
    }
    return "";
  };

  return (
    <section id="demo" className={styles.demoSection}>
      <div className={`${styles.sectionHeader} container`}>
        <span className={styles.tagline}>Interactive Replay</span>
        <h2 className={styles.title}>Visual Code-Path Tracing</h2>
        <p className={styles.subtitle}>
          Select a production bug simulation below. Click &quot;Simulate Trace Replay&quot; to see how Glide highlights active code paths and reports errors in real-time.
        </p>
      </div>

      <div className="container">
        {/* Selector Tabs */}
        <div className={styles.bugSelector}>
          {BUGS.map((bug, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isReplaying) setSelectedBugIndex(index);
              }}
              disabled={isReplaying}
              className={`${styles.bugTab} ${selectedBugIndex === index ? styles.bugTabActive : ""}`}
            >
              {bug.title}
            </button>
          ))}
        </div>

        {/* Playground Grid Board */}
        <div className={`${styles.board} glass`}>
          {/* Left Side: Code terminal mock */}
          <div className={styles.editorCard}>
            <div className={styles.editorHeader}>
              <div className={styles.mockupWindowControls}>
                <span className={`${styles.dot} ${styles.dotRed}`} />
                <span className={`${styles.dot} ${styles.dotYellow}`} />
                <span className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.editorFilename}>{scenario.filename}</span>
              <div style={{ width: 48 }} />
            </div>
            
            <div className={styles.editorBody}>
              {scenario.codeLines.map((lineText, idx) => {
                const lineNum = idx + 1;
                return (
                  <div key={idx} className={`${styles.codeLine} ${getLineClass(lineNum)}`}>
                    <span className={styles.codeLineNumber}>{lineNum}</span>
                    <span>{lineText}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Telemetry logs and AI panel */}
          <div className={styles.telemetryCard}>
            <div className={styles.controlPanel}>
              <div className={styles.controlHeader}>
                <span className={styles.controlTitle}>Trace Execution Flow</span>
                <span className={styles.stepIndicator}>
                  {step === -1 ? "Idle" : `Step ${step + 1} of ${scenario.steps.length}`}
                </span>
              </div>

              <div className={styles.flowTrack}>
                {scenario.steps.map((s, idx) => {
                  const isActive = step >= idx;
                  const isCurrent = step === idx;
                  const isFail = s.status === "failed" && isActive;

                  return (
                    <div
                      key={idx}
                      className={`${styles.flowStep} ${
                        isCurrent ? styles.flowStepActive : ""
                      } ${isFail ? styles.flowStepError : ""}`}
                    >
                      <div
                        className={`${styles.flowStepIcon} ${
                          !isActive
                            ? styles.iconPending
                            : isFail
                            ? styles.iconFail
                            : styles.iconRun
                        }`}
                      >
                        {isFail ? "✗" : isActive ? "✓" : idx + 1}
                      </div>
                      
                      <div className={styles.flowDetails}>
                        <span className={styles.flowName}>{s.name}</span>
                        {isActive && <span className={styles.flowDesc}>{s.description}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={startReplay}
                disabled={isReplaying}
                className={`${styles.actionBtn} ${isReplaying ? styles.actionBtnDisabled : ""}`}
              >
                {isReplaying ? "Simulation Active..." : "Simulate Trace Replay"}
              </button>
            </div>

            {/* AI Diagnostics Box */}
            <div
              className={`${styles.aiDiagnosticBox} ${
                step === scenario.steps.length - 1 ? styles.aiDiagnosticBoxVisible : ""
              }`}
            >
              <span className={styles.aiDemoIcon}>✨</span>
              <div className={styles.aiReport}>
                <span className={styles.aiReportTitle}>AI Diagnosis Report</span>
                <p 
                  className={styles.aiReportDesc}
                  dangerouslySetInnerHTML={{ __html: scenario.aiInsight }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
