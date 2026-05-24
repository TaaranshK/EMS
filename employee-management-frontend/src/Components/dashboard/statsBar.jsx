import { ClipboardText, Kanban, UserCheck, UsersThree } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function StatsBar({ stats }) {
  const total = stats?.totalEmployees ?? 0;
  const active = stats?.activeEmployees ?? 0;
  const inactive = stats?.inactiveEmployees ?? 0;
  const pending = stats?.pendingOnboarding ?? 0;
  const complete = stats?.onboardingComplete ?? 0;

  const pct = (value, base) => {
    if (!base || base <= 0) return 0;
    const raw = (value / base) * 100;
    return Math.max(0, Math.min(100, Math.round(raw)));
  };

  const interviewsPct = pct(pending, total);
  const hiredPct = pct(active, total);
  const completePct = pct(complete, total);
  const outputPct = pct(Math.max(0, active - pending), total);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        gap: "14px",
        marginBottom: "18px",
        padding: "14px",
        borderRadius: "22px",
        background: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(124, 58, 237, 0.16)",
        boxShadow: "0 18px 50px -40px rgba(109, 40, 217, 0.45)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Left — progress */}
      <div style={{ flex: 1, minWidth: 520 }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <Pill label="Interviews" value={`${interviewsPct}%`} tone="solid" />
          <Pill label="Hired" value={`${hiredPct}%`} tone="soft" />
          <Pill label="Output" value={`${outputPct}%`} tone="outline" />

          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>Project completion</p>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>{completePct}%</p>
            </div>
            <div
              style={{
                background: "var(--lavender-100)",
                borderRadius: "999px",
                height: "34px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(124, 58, 237, 0.14)",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completePct}%` }}
                transition={{ duration: 0.9, delay: 0.15 }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, var(--purple-600), var(--purple-700))",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "14px",
                }}
              >
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{completePct}%</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — stat chips */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <StatChip icon={<UsersThree size={18} weight="regular" color="var(--purple-700)" />} value={total} label="Employees" />
        <StatChip icon={<UserCheck size={18} weight="regular" color="var(--purple-700)" />} value={active} label="Active" />
        <StatChip icon={<Kanban size={18} weight="regular" color="var(--purple-700)" />} value={pending} label="Pending" />
        <StatChip icon={<ClipboardText size={18} weight="regular" color="var(--purple-700)" />} value={inactive} label="Inactive" />
      </div>
    </motion.div>
  );
}

function Pill({ label, value, tone }) {
  const stylesByTone = {
    solid: {
      background: "linear-gradient(90deg, var(--purple-600), var(--purple-700))",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    soft: {
      background: "rgba(124, 58, 237, 0.16)",
      color: "var(--ink)",
      border: "1px solid rgba(124, 58, 237, 0.18)",
    },
    outline: {
      background: "rgba(255,255,255,0.85)",
      color: "var(--ink)",
      border: "1px solid rgba(124, 58, 237, 0.18)",
    },
  };

  return (
    <div style={{ minWidth: 90 }}>
      <p style={{ fontSize: "11px", color: "var(--muted)", margin: "0 0 6px" }}>{label}</p>
      <div
        style={{
          padding: "8px 18px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.2px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...stylesByTone[tone],
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatChip({ icon, value, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(124, 58, 237, 0.14)",
        boxShadow: "0 10px 28px -26px rgba(109, 40, 217, 0.55)",
      }}
    >
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "14px",
          background: "rgba(124, 58, 237, 0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink)" }}>{value ?? 0}</div>
        <div style={{ fontSize: "11px", color: "var(--muted)" }}>{label}</div>
      </div>
    </div>
  );
}

