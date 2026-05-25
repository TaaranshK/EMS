import { motion } from "framer-motion";
import Card from "../../../Components/dashboard/Card";
import PageSeo from "../../../Components/seo/PageSeo";

export default function MeetingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <PageSeo
        title="My Meetings"
        description="Review meeting information and upcoming employee meeting visibility inside your workspace."
      />
      <Card style={{ width: "min(720px, 100%)", textAlign: "center" }}>
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "20px",
            background: "#111827",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 1.5rem",
            color: "#fff",
          }}
        >
          M
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "var(--ink)", marginBottom: "8px" }}>Meetings</h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
          Meeting visibility is coming next. For now, scheduling is still managed from the admin side.
        </p>
      </Card>
    </motion.div>
  );
}
