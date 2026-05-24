import { motion } from "framer-motion";
import teamImage from "../../assets/team.png";

export default function ImagePanel() {
  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        position: "relative",
        aspectRatio: "928 / 1150",
        maxHeight: "100%",
        borderRadius: "36px",
        overflow: "hidden",
        backgroundColor: "#0b0b10",
      }}
    >
      {/* Blurred background fill (removes grey/empty bars when using contain) */}
      <img
        src={teamImage}
        alt="Team collaborating"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          filter: "blur(22px)",
          transform: "scale(1.08)",
          opacity: 0.55,
        }}
      />

      {/* Foreground image (keeps full photo visible) */}
      <img
        src={teamImage}
        alt="Team collaborating"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
          position: "relative",
          zIndex: 1,
        }}
      />
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.10)", borderRadius: "36px", zIndex: 2 }} />

      {/* Top Floating Card - Task Review */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          zIndex: 3,
          backgroundColor: "#9333EA",
          borderRadius: "1rem",
          padding: "1rem 1.25rem",
          boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.3)",
          maxWidth: "220px",
        }}
      >
        <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fff", margin: "0" }}>Task Review With Team</p>
        <p style={{ fontSize: "0.8rem", color: "#e9d5ff", margin: "0.35rem 0 0 0" }}>09:30am-10:00am</p>
      </motion.div>

      {/* Calendar Card - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          position: "absolute",
          bottom: "1.15rem",
          right: "1.15rem",
          zIndex: 3,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(1rem)",
          borderRadius: "1.05rem",
          padding: "0.8rem 1rem",
          boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.2)",
          transform: "scale(0.92)",
          transformOrigin: "bottom right",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.45rem", textAlign: "center" }}>
          {[
            { day: "Sun", date: "22" },
            { day: "Mon", date: "23" },
            { day: "Tue", date: "24" },
            { day: "Wed", date: "25" },
            { day: "Thu", date: "26" },
            { day: "Fri", date: "27" },
            { day: "Sat", date: "28" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: "600", color: "#9ca3af", margin: "0 0 0.25rem 0" }}>{item.day}</p>
              <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#000000", margin: "0" }}>{item.date}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Floating Card - Daily Meeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          position: "absolute",
          bottom: "1.15rem",
          left: "1.15rem",
          zIndex: 3,
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(1rem)",
          borderRadius: "1.05rem",
          padding: "0.9rem 1.05rem",
          boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.2)",
          maxWidth: "240px",
          width: "auto",
          transform: "scale(0.92)",
          transformOrigin: "bottom left",
        }}
      >
        <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1f2937", margin: "0 0 0.25rem 0" }}>🗓 Daily Meeting</p>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0 0 0.75rem 0" }}>12:00pm-01:00pm</p>
        <div style={{ display: "flex", gap: "0" }}>
          {["A", "B", "C", "D"].map((letter, i) => (
            <div key={i} style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "50%",
              backgroundColor: "#e9d5ff",
              border: "2.5px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: "700",
              color: "#a855f7",
              marginLeft: i === 0 ? 0 : "-0.6rem",
            }}>
              {letter}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
