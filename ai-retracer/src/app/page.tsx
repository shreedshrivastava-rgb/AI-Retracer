import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VisualTraceDemo from "@/components/VisualTraceDemo";
import FeaturesGrid from "@/components/FeaturesGrid";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Floating Glassmorphic Header */}
      <Navbar />
      
      {/* Main Page Layout */}
      <main style={{ padding: "0 1rem", position: "relative", zIndex: 1 }}>
        <Hero />
        <VisualTraceDemo />
        <FeaturesGrid />
        <WaitlistSection />
      </main>
      
      {/* Bottom Footer Section */}
      <Footer />
    </>
  );
}
