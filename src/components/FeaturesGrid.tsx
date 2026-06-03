"use client";

import React from "react";
import styles from "./FeaturesGrid.module.css";

interface Feature {
  icon: string;
  colorType: "purple" | "cyan" | "amber";
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: "⏪",
    colorType: "purple",
    title: "Visual Time-Travel Replay",
    description: "Reconstruct and visually step through execution code paths leading to production crashes, exactly matching actual stack state."
  },
  {
    icon: "🔮",
    colorType: "cyan",
    title: "AI Root-Cause Isolation",
    description: "Trained large models parse variable assignments, call stacks, and runtime memory to isolate the exact line causing the crash."
  },
  {
    icon: "🌐",
    colorType: "amber",
    title: "Omnipresent Tracing Hub",
    description: "Integrate with OpenTelemetry, Datadog, CloudWatch, and GitHub. Instantly map arbitrary server logs back to source-code lines."
  },
  {
    icon: "⚡",
    colorType: "cyan",
    title: "Zero-Overhead Tracking",
    description: "Leverage compilation decorators or low-level eBPF kernel hooks. Trace high-throughput servers without introducing execution latency."
  },
  {
    icon: "🧪",
    colorType: "purple",
    title: "Auto-Generated Regressions",
    description: "Convert caught production crash vectors into executable local Jest or Vitest files. Securely lock in regressions during local refactoring."
  },
  {
    icon: "👥",
    colorType: "amber",
    title: "Collaborative Sandboxes",
    description: "Instantly share active debug replays with other developers. Collaborate together in real-time without cloning complex environments."
  }
];

export default function FeaturesGrid() {
  return (
    <section id="features" className={styles.featuresSection}>
      <div className={`${styles.sectionHeader} container`}>
        <span className={styles.tagline}>Core Platform Specs</span>
        <h2 className={styles.title}>Reconstruct. Isolate. Solve.</h2>
        <p className={styles.subtitle}>
          Glide provides complete observability by marrying telemetry data with source code intelligence.
        </p>
      </div>

      <div className={`${styles.grid} container`}>
        {FEATURES.map((feature, idx) => {
          let iconClass = styles.iconPurple;
          if (feature.colorType === "cyan") iconClass = styles.iconCyan;
          if (feature.colorType === "amber") iconClass = styles.iconAmber;

          return (
            <div key={idx} className={`${styles.card} glass`}>
              <div className={`${styles.iconWrapper} ${iconClass}`}>
                {feature.icon}
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
