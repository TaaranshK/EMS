import { motion } from "framer-motion";
import { HourglassMedium } from "@phosphor-icons/react";

export default function ComingSoonPage({ pageName }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: "16px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          background: "#2d2d3a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HourglassMedium size={32} color="#fff" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1a1a2e" }}
      >
        {pageName} — Coming Soon
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ margin: 0, fontSize: "13px", color: "#aaa" }}
      >
        This feature is under development
      </motion.p>
    </div>
  );
}

