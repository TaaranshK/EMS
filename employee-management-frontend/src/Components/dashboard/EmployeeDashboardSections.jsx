import { motion } from "framer-motion";
import {
  CalendarBlank,
  ClockCounterClockwise,
  CurrencyCircleDollar,
  IdentificationCard,
  Target,
} from "@phosphor-icons/react";
import EmployeeCard from "./EmployeeCard";

export function EmployeeStatsRibbon({ employee, taskSummary, salary }) {
  const completed = taskSummary?.completed ?? 0;
  const total = taskSummary?.total ?? 0;
  const progress = taskSummary?.progress ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        flexWrap: "wrap",
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
      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <RibbonPill label="Role" value={employee?.jobTitle || "Employee"} tone="solid" />
          <RibbonPill label="Department" value={employee?.department || "Unassigned"} tone="soft" />
          <RibbonPill label="Salary" value={salary} tone="outline" />

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>Onboarding completion</p>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>{progress}%</p>
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
                animate={{ width: `${progress}%` }}
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
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{progress}%</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <MiniStat icon={<IdentificationCard size={18} weight="regular" color="var(--purple-700)" />} value={employee?.email || "--"} label="Account" compact />
        <MiniStat icon={<Target size={18} weight="regular" color="var(--purple-700)" />} value={`${completed}/${total}`} label="Tasks" />
        <MiniStat icon={<ClockCounterClockwise size={18} weight="regular" color="var(--purple-700)" />} value="08:30" label="Today" />
        <MiniStat icon={<CalendarBlank size={18} weight="regular" color="var(--purple-700)" />} value="3" label="This Week" />
      </div>
    </motion.div>
  );
}

export function EmployeeOverviewGrid({ employee, taskSummary, tasks }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px",
        marginTop: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <EmployeeCard employee={employee} />
        <QuickFacts employee={employee} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <ProgressCard taskSummary={taskSummary} />
        <CalendarCard tasks={tasks} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <TimeTrackerCard />
        <SalaryCard salary={employee?.salary} />
      </div>

      <TaskPanel tasks={tasks} taskSummary={taskSummary} />
    </div>
  );
}

function RibbonPill({ label, value, tone }) {
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
    <div style={{ minWidth: 110, maxWidth: 180 }}>
      <p style={{ fontSize: "11px", color: "var(--muted)", margin: "0 0 6px" }}>{label}</p>
      <div
        title={value}
        style={{
          padding: "8px 18px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.2px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...stylesByTone[tone],
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MiniStat({ icon, value, label, compact = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: compact ? "10px 12px" : "10px 14px",
        minWidth: compact ? 160 : 110,
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
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ lineHeight: 1.1, minWidth: 0 }}>
        <div
          title={value}
          style={{
            fontSize: compact ? "13px" : "18px",
            fontWeight: 800,
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "11px", color: "var(--muted)" }}>{label}</div>
      </div>
    </div>
  );
}

function SurfaceCard({ children, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
      <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>{children}</h3>
      {right}
    </div>
  );
}

function QuickFacts({ employee }) {
  const rows = [
    { label: "Email", value: employee?.email || "--" },
    { label: "Phone", value: employee?.phoneNumber || "Add in profile" },
    { label: "LinkedIn", value: employee?.linkedInUrl ? "Connected" : "Not added" },
    { label: "Status", value: employee?.isActive ? "Active" : "Inactive" },
  ];

  return (
    <SurfaceCard>
      <SectionTitle>Profile Snapshot</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {rows.map((row) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "13px" }}>
            <span style={{ color: "#888" }}>{row.label}</span>
            <strong style={{ color: "var(--ink)", textAlign: "right" }}>{row.value}</strong>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

function ProgressCard({ taskSummary }) {
  const total = taskSummary?.total ?? 0;
  const completed = taskSummary?.completed ?? 0;
  const progress = taskSummary?.progress ?? 0;

  return (
    <SurfaceCard>
      <SectionTitle right={<span style={{ fontSize: "12px", color: "#888" }}>{completed}/{total} done</span>}>
        Progress Pulse
      </SectionTitle>
      <div style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: "30px", fontWeight: "700", color: "var(--ink)" }}>{progress}%</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>Keep moving through onboarding milestones.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <DotMetric label="Pending" value={Math.max(0, total - completed)} tone="#f59e0b" />
            <DotMetric label="Done" value={completed} tone="#16a34a" />
          </div>
        </div>
        <div style={{ background: "var(--lavender-100)", borderRadius: "999px", height: "12px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
            style={{ height: "100%", background: "linear-gradient(90deg, #8b5cf6, #5b21b6)", borderRadius: "999px" }}
          />
        </div>
      </div>
    </SurfaceCard>
  );
}

function DotMetric({ label, value, tone }) {
  return (
    <div style={{ minWidth: 68 }}>
      <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#888" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: tone }} />
        <strong style={{ fontSize: "13px", color: "var(--ink)" }}>{value}</strong>
      </div>
    </div>
  );
}

function CalendarCard({ tasks }) {
  const nextTask = tasks.find((task) => task.status !== "Completed" && task.scheduledAt) || tasks.find((task) => task.scheduledAt);
  const month = new Date().toLocaleString(undefined, { month: "long", year: "numeric" });
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

  return (
    <SurfaceCard>
      <SectionTitle right={<span style={{ fontSize: "12px", color: "#888" }}>{month}</span>}>
        Calendar
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "14px" }}>
        {days.map((day, index) => (
          <div
            key={day.toISOString()}
            style={{
              background: index === 0 ? "linear-gradient(160deg, rgba(124,58,237,0.20), rgba(109,40,217,0.48))" : "var(--lavender-50)",
              borderRadius: "14px",
              padding: "10px 0",
              textAlign: "center",
              border: "1px solid rgba(124,58,237,0.10)",
            }}
          >
            <div style={{ fontSize: "10px", color: "#888" }}>{day.toLocaleString(undefined, { weekday: "short" })}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>{day.getDate()}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "rgba(124,58,237,0.08)",
          borderRadius: "16px",
          padding: "12px 14px",
          border: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#888" }}>Next scheduled item</p>
        <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
          {nextTask?.title || "No scheduled tasks yet"}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#888" }}>
          {nextTask?.scheduledAt ? new Date(nextTask.scheduledAt).toLocaleString() : "Your calendar will populate as tasks get dates."}
        </p>
      </div>
    </SurfaceCard>
  );
}

function TimeTrackerCard() {
  const clock = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <SurfaceCard>
      <SectionTitle>Time Tracker</SectionTitle>
      <div style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "var(--ink)" }}>{clock}</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>Clock in support is coming soon.</p>
          </div>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background: "linear-gradient(160deg, rgba(124,58,237,0.12), rgba(109,40,217,0.26))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClockCounterClockwise size={26} color="var(--purple-700)" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <SmallStat label="Today" value="7h 35m" />
          <SmallStat label="Week" value="31h 10m" />
        </div>
      </div>
    </SurfaceCard>
  );
}

function SmallStat({ label, value }) {
  return (
    <div style={{ background: "var(--lavender-50)", borderRadius: "14px", padding: "12px 14px", border: "1px solid rgba(124,58,237,0.10)" }}>
      <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#888" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>{value}</p>
    </div>
  );
}

function SalaryCard({ salary }) {
  const formatted = salary ? `Rs ${Number(salary).toLocaleString()}` : "--";

  return (
    <SurfaceCard>
      <SectionTitle>Salary Overview</SectionTitle>
      <div
        style={{
          background: "linear-gradient(165deg, rgba(124,58,237,0.92), rgba(109,40,217,0.92))",
          borderRadius: "18px",
          padding: "18px",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.72)" }}>Annual salary</p>
            <p style={{ margin: "6px 0 0", fontSize: "24px", fontWeight: 800 }}>{formatted}</p>
          </div>
          <CurrencyCircleDollar size={32} color="#fff" />
        </div>
        <div style={{ display: "grid", gap: "8px", fontSize: "12px" }}>
          <SalaryRow label="Monthly estimate" value={salary ? `Rs ${Math.round(Number(salary) / 12).toLocaleString()}` : "--"} />
          <SalaryRow label="Payout status" value="On schedule" />
          <SalaryRow label="Visibility" value="Private" />
        </div>
      </div>
    </SurfaceCard>
  );
}

function SalaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
      <span style={{ color: "rgba(255,255,255,0.70)" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TaskPanel({ tasks, taskSummary }) {
  const topTasks = (tasks || []).slice(0, 8);
  const total = taskSummary?.total ?? topTasks.length;
  const completed = taskSummary?.completed ?? topTasks.filter((task) => task.status === "Completed").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
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
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--ink)" }}>Task Focus</p>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: 900, color: "var(--ink)" }}>{taskSummary?.progress ?? 0}%</p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          {[
            { label: "Assigned", color: "rgba(124,58,237,0.35)" },
            { label: "Active", color: "rgba(109,40,217,0.45)" },
            { label: "Complete", color: "var(--purple-700)" },
          ].map((bar) => (
            <div key={bar.label} style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontSize: "10px", color: "var(--muted)" }}>{bar.label}</p>
              <div style={{ height: "8px", borderRadius: "4px", background: bar.color }} />
            </div>
          ))}
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "11px", color: "var(--muted)" }}>{completed}/{total} tasks complete</p>
      </div>

      <div
        style={{
          background: "linear-gradient(165deg, rgba(124,58,237,0.92), rgba(109,40,217,0.92))",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 22px 60px -50px rgba(109,40,217,0.75)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>Onboarding Tasks</p>
          <p style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#fff" }}>
            {completed}/{total}
          </p>
        </div>

        {topTasks.length === 0 ? (
          <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.78)" }}>Your task list will appear here once onboarding items are assigned.</p>
        ) : (
          topTasks.map((task, index) => {
            const isDone = task.status === "Completed";

            return (
              <div
                key={task.id ?? `${task.title}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 0",
                  borderBottom: index < topTasks.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
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
                    <Target size={16} weight="regular" color={isDone ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.92)"} />
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
                    <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>
                      {task.scheduledAt ? new Date(task.scheduledAt).toLocaleString() : task.status}
                    </p>
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
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
