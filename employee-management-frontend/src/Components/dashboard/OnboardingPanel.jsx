import { motion } from "framer-motion";
import {
  ChatCircle,
  ClipboardText,
  Desktop,
  Microphone,
  RocketLaunch,
  UserCircle,
  UsersThree,
  Wrench,
} from "@phosphor-icons/react";

const TASK_DEFS = [
  { title: "Interview", icon: Microphone },
  { title: "Training Session", icon: Desktop },
  { title: "Project Kickoff", icon: RocketLaunch },
  { title: "Discuss UX Goals", icon: ChatCircle },
  { title: "Equipment Setup", icon: Wrench },
  { title: "Meet The Team", icon: UsersThree },
  { title: "Complete Profile", icon: UserCircle },
  { title: "HR Policy Review", icon: ClipboardText },
];

const TASK_BASE_DATE = new Date("2026-01-05T09:15:00");

const formatTaskDate = (date) =>
  date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OnboardingPanel({ stats, employees = [] }) {
  const onboardingCount =
    (stats?.onboardingComplete ?? 0) + (stats?.pendingOnboarding ?? 0);
  const total = Math.max(onboardingCount, TASK_DEFS.length);
  const completed = Math.max(0, Math.min(total, stats?.onboardingComplete ?? 0));
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const recentEmployees = stats?.recentEmployees?.length ? stats.recentEmployees : employees;
  const tasks =
    recentEmployees.length > 0
      ? recentEmployees.slice(0, TASK_DEFS.length).map((employee, index) => {
          const template = TASK_DEFS[index % TASK_DEFS.length];
          const createdAt = employee?.createdAt ? new Date(employee.createdAt) : null;

          return {
            ...template,
            title: `${employee.firstName} ${employee.lastName}`,
            sub: employee.department || formatTaskDate(createdAt ?? TASK_BASE_DATE),
            isDone: Boolean(employee.isPasswordChanged),
          };
        })
      : TASK_DEFS.map((task, index) => {
          const date = new Date(TASK_BASE_DATE);
          date.setDate(TASK_BASE_DATE.getDate() + index);
          date.setHours(9 + (index % 4) * 2, 15 + (index % 3) * 10, 0, 0);
          return { ...task, sub: formatTaskDate(date), isDone: index < completed };
        });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      {/* Top — Onboarding % */}
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 16px 50px -44px rgba(109,40,217,0.55)",
          border: "1px solid rgba(124,58,237,0.14)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--ink)" }}>Onboarding</p>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: 900, color: "var(--ink)" }}>{percent}%</p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          {[
            { label: "Kickoff", color: "rgba(124,58,237,0.35)" },
            { label: "Training", color: "rgba(109,40,217,0.45)" },
            { label: "Complete", color: "var(--purple-700)" },
          ].map((bar) => (
            <div key={bar.label} style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontSize: "10px", color: "var(--muted)" }}>{bar.label}</p>
              <div style={{ height: "8px", borderRadius: "4px", background: bar.color }} />
            </div>
          ))}
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "11px", color: "var(--muted)" }}>Tasks</p>
      </div>

      {/* Bottom — Tasks */}
      <div
        style={{
          background: "linear-gradient(165deg, rgba(124,58,237,0.92), rgba(109,40,217,0.92))",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 22px 60px -50px rgba(109,40,217,0.75)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>Onboarding Tasks</p>
          <p style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#fff" }}>
            {completed}/{total}
          </p>
        </div>

        {tasks.map((task, i) => {
          const Icon = task.icon;
          const isDone = task.isDone ?? i < completed;

          return (
            <div
              key={task.title}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: i < tasks.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: isDone ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} weight="regular" color={isDone ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.92)"} />
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      fontWeight: 600,
                      color: isDone ? "rgba(255,255,255,0.72)" : "#fff",
                      textDecoration: isDone ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>{task.sub}</p>
                </div>
              </div>

              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: isDone ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: isDone ? "1.5px solid rgba(255,255,255,0.35)" : "1.5px solid rgba(255,255,255,0.18)",
                }}
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5L4 7L8 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
