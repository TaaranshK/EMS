import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getEmployees } from "../../services/Dashboard";
import NavBar from "../../Components/dashboard/NavBar";
import StatsBar from "../../Components/dashboard/statsBar";
import EmployeeCard from "../../Components/dashboard/EmployeeCard";
import OnboardingPanel from "../../Components/dashboard/OnboardingPanel";
import InviteModal from "../../Components/dashboard/InviteModal";
import EmployeesPage from "./EmployeesPage";
import HiringPage from "./HiringPage";
import PayrollPage from "./PayrollPage";
import ComingSoonPage from "./ComingSoonPage";
import MeetingsPage from "./MeetingsPage";
import { clearAuthStorage, getStoredToken } from "../../utils/authStorage";
import {
  Play, Pause, Timer,
  CaretLeft, CaretRight,
  DotsThree,
  UserCircle
} from "@phosphor-icons/react";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats,           setStats]           = useState(null);
  const [employees,       setEmployees]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const loadData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError("");
    try {
      const token = getStoredToken();
      if (!token) {
        setError("No auth token found. Please login again.");
        return;
      }
      const [statsData, empData] = await Promise.all([
        getDashboardStats(),
        getEmployees({ page: 1, pageSize: 10 })
      ]);
      setStats(statsData);
      setEmployees(empData.data || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setError("");
      try {
        const token = getStoredToken();
        if (!token) {
          setError("No auth token found. Please login again.");
          return;
        }
        const [statsData, empData] = await Promise.all([
          getDashboardStats(),
          getEmployees({ page: 1, pageSize: 10 })
        ]);
        setStats(statsData);
        setEmployees(empData.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    void loadInitialData();
  }, []);

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login");
  };

  if (loading) return (
    <div style={{
      height: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "var(--lavender-50)", fontSize: "14px", color: "var(--muted)"
    }}>
      Loading dashboard...
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Employees": return <EmployeesPage />;
      case "Payroll": return <PayrollPage />;
      case "Hiring": return <HiringPage onInvite={() => setShowInviteModal(true)} />;
      case "Devices": return <ComingSoonPage pageName="Devices" />;
      case "Meetings": return <MeetingsPage />;
      default:
        return (
          <DashboardContent
            stats={stats}
            employees={employees}
            error={error}
            onInvite={() => setShowInviteModal(true)}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eeecf3", fontFamily: "'Georgia', serif" }}>
      <NavBar
        active={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />
      {renderPage()}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}

function DashboardContent({ stats, employees, error, onInvite }) {
  return (
    <div style={{ padding: "0 28px 32px" }}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "38px",
          fontWeight: "700",
          color: "#1a1a2e",
          margin: "8px 0 20px",
        }}
      >
        Welcome back, Admin
      </motion.h1>
      <StatsBar stats={stats} />
      {error && (
        <p style={{ margin: "10px 0 0", color: "#e53e3e", fontSize: "13px" }}>
          {error}
        </p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr 1.2fr 1fr",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <EmployeeCard employee={employees[0]} />
          <AccordionSection />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <ProgressCard />
          <CalendarCard />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <TimeTrackerCard />
          <EmployeeTable employees={employees} onInvite={onInvite} />
        </div>
        <OnboardingPanel stats={stats} />
      </div>
    </div>
  );
}

// â”€â”€ Progress Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProgressCard() {
  const hour     = new Date().getHours();
  const workHrs  = Math.max(0, Math.min(8, hour - 9)).toFixed(1);
  const days     = ["S", "M", "T", "W", "T", "F", "S"];
  const today    = new Date().getDay();
  const heights  = [30, 55, 70, 50, 85, 90, 35];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        background: "#fff", borderRadius: "20px",
        padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>Progress</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "4px 0" }}>
            <span style={{ fontSize: "34px", fontWeight: "700", color: "var(--ink)" }}>
              {workHrs} h
            </span>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "#aaa", lineHeight: 1.3 }}>
                Work Hours<br />this week
              </p>
            </div>
          </div>
        </div>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: "#f0eef5", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <CaretRight size={14} color="#666" />
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{
        display: "flex", alignItems: "flex-end",
        gap: "6px", marginTop: "20px", height: "90px",
        position: "relative"
      }}>
        {days.map((day, i) => (
          <div key={i} style={{
            flex: 1, display: "flex",
            flexDirection: "column", alignItems: "center", gap: "6px"
          }}>
            {/* Tooltip on active bar */}
            {i === today && (
              <div style={{
                background: "var(--purple-700)", color: "#fff",
                fontSize: "10px", padding: "3px 7px",
                borderRadius: "6px", whiteSpace: "nowrap"
              }}>
                {workHrs}m
              </div>
            )}
            <div style={{
              width: "100%",
              height: `${heights[i]}%`,
              background: i === today ? "var(--purple-700)" : "var(--lavender-100)",
              borderRadius: "6px 6px 3px 3px",
              transition: "height 0.5s ease"
            }} />
            <span style={{ fontSize: "10px", color: "#bbb" }}>{day}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// â”€â”€ Time Tracker Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TimeTrackerCard() {
  const [time,    setTime]    = useState(new Date());
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const hours   = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");

  // Circle progress based on minutes
  const progress    = (time.getMinutes() / 60) * 314;
  const circumference = 314;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: "#fff", borderRadius: "20px",
        padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>Time tracker</p>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: "#f0eef5", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <CaretRight size={14} color="#666" />
        </div>
      </div>

      {/* Clock Circle */}
      <div style={{
        display: "flex", justifyContent: "center",
        alignItems: "center", margin: "16px 0"
      }}>
        <div style={{ position: "relative", width: "130px", height: "130px" }}>
          <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
            {/* Dots ring */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i / 36) * 2 * Math.PI;
              const x     = 65 + 58 * Math.cos(angle);
              const y     = 65 + 58 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="1.5" fill="#e0dce8" />;
            })}
            {/* Progress Arc */}
            <circle
              cx="65" cy="65" r="50"
              fill="none" stroke="#e8e5ee" strokeWidth="8"
            />
            <circle
              cx="65" cy="65" r="50"
              fill="none" stroke="var(--purple-700)" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", textAlign: "center"
          }}>
            <p style={{
              margin: 0, fontSize: "22px",
              fontWeight: "700", color: "var(--ink)", letterSpacing: "1px"
            }}>
              {hours}:{minutes}
            </p>
            <p style={{ margin: 0, fontSize: "10px", color: "#aaa" }}>Work Time</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <button
          onClick={() => setRunning(true)}
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            border: "1px solid #eee", background: "#f9f8fc",
            display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer"
          }}
        >
          <Play size={14} color="#444" weight="fill" />
        </button>
        <button
          onClick={() => setRunning(false)}
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            border: "1px solid #eee", background: "#f9f8fc",
            display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer"
          }}
        >
          <Pause size={14} color="#444" weight="fill" />
        </button>
        <button style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border: "none", background: "var(--purple-700)",
          display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer"
        }}>
          <Timer size={14} color="#fff" />
        </button>
      </div>
    </motion.div>
  );
}

// â”€â”€ Calendar Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CalendarCard() {
  const now    = new Date();
  const month  = now.toLocaleString("default", { month: "long" });
  const year   = now.getFullYear();
  const today  = now.getDate();
  const days   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates  = [today - 1, today, today + 1, today + 2, today + 3, today + 4, today + 5];

  const events = [
    {
      day: today,
      time: "8:00 am",
      title: "Weekly Team Sync",
      sub: "Discuss progress on projects",
      variant: "solid",
      attendees: 3
    },
    {
      day: today + 1,
      time: "10:00 am",
      title: "Onboarding Session",
      sub: "Introduction for new hires",
      variant: "soft",
      attendees: 3
    }
  ];

  const times = ["8:00 am", "9:00 am", "10:00 am", "11:00 am"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: "rgba(255,255,255,0.85)", borderRadius: "20px",
        padding: "22px", boxShadow: "0 16px 50px -44px rgba(109,40,217,0.55)",
        border: "1px solid rgba(124,58,237,0.14)",
        flex: 1
      }}
    >
      {/* Month Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "16px"
      }}>
        <button style={{
          padding: "5px 14px", borderRadius: "999px",
          border: "1px solid rgba(124,58,237,0.16)", background: "rgba(250,245,255,0.8)",
          fontSize: "12px", color: "#888", cursor: "pointer"
        }}>
          <CaretLeft size={10} /> Prev
        </button>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>
          {month} {year}
        </p>
        <button style={{
          padding: "5px 14px", borderRadius: "999px",
          border: "1px solid rgba(124,58,237,0.16)", background: "rgba(250,245,255,0.8)",
          fontSize: "12px", color: "#888", cursor: "pointer"
        }}>
          Next <CaretRight size={10} />
        </button>
      </div>

      {/* Day Headers */}
      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
        <div />
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "10px", color: "#bbb" }}>{d}</p>
            <p style={{
              fontSize: "13px", fontWeight: "600",
              color: dates[i] === today ? "#fff" : "var(--ink)",
              background: dates[i] === today ? "var(--purple-700)" : "transparent",
              borderRadius: "50%", width: "26px", height: "26px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "4px auto 0"
            }}>
              {dates[i]}
            </p>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div style={{ position: "relative" }}>
        {times.map((t, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "60px repeat(7, 1fr)",
            gap: "4px", height: "52px",
            borderTop: "1px solid var(--lavender-100)",
            alignItems: "start", paddingTop: "6px"
          }}>
            <span style={{ fontSize: "11px", color: "#bbb" }}>{t}</span>
          </div>
        ))}

        {/* Events Overlay (grid-aligned) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "60px repeat(7, 1fr)",
            gridTemplateRows: `repeat(${times.length}, 52px)`,
            gap: "4px",
            paddingTop: "6px",
            pointerEvents: "none",
          }}
        >
          {events.map((ev) => {
            const dayIndex = dates.indexOf(ev.day);
            const timeIndex = times.indexOf(ev.time);
            if (dayIndex < 0 || timeIndex < 0) return null;

            const isSolid = ev.variant === "solid";
            return (
              <div
                key={`${ev.day}-${ev.time}-${ev.title}`}
                style={{
                  gridColumn: `${dayIndex + 2}`,
                  gridRow: `${timeIndex + 1}`,
                  alignSelf: "center",
                  justifySelf: "start",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}>
                  {Array.from({ length: Math.max(0, ev.attendees ?? 0) }).map((_, j) => (
                    <div
                      key={j}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: isSolid ? "rgba(124,58,237,0.20)" : "rgba(124,58,237,0.12)",
                        marginLeft: j === 0 ? 0 : "-8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isSolid ? "1px solid rgba(124,58,237,0.30)" : "1px solid rgba(124,58,237,0.18)",
                        boxShadow: isSolid ? "0 10px 22px -18px rgba(109,40,217,0.55)" : "none",
                      }}
                    >
                      <UserCircle size={16} weight="fill" color={isSolid ? "var(--purple-700)" : "rgba(109,40,217,0.65)"} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// â”€â”€ Accordion Section (Pension, Devices, Compensation, Benefits) â”€â”€
function AccordionSection() {
  const [open, setOpen] = useState(null);

  const sections = [
    {
      key: "pension",
      label: "Pension contributions",
      content: (
        <div style={{ padding: "10px 0", fontSize: "13px", color: "#666" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span>Employee contribution</span><strong>5%</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span>Employer contribution</span><strong>8%</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total monthly</span><strong>$195</strong>
          </div>
        </div>
      )
    },
    {
      key: "devices",
      label: "Devices",
      content: (
        <div style={{ padding: "10px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "8px",
                background: "#e8e5ee", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "20px"
              }}>
                ðŸ’»
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "var(--ink)" }}>
                  MacBook Air
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>Version M1</p>
              </div>
            </div>
            <DotsThree size={20} color="#aaa" />
          </div>
        </div>
      )
    },
    {
      key: "compensation",
      label: "Compensation Summary",
      content: (
        <div style={{ padding: "10px 0", fontSize: "13px", color: "#666" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span>Base Salary</span><strong>$1,200/mo</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span>Bonus</span><strong>$200</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Annual</span><strong>$16,800</strong>
          </div>
        </div>
      )
    },
    {
      key: "benefits",
      label: "Employee Benefits",
      content: (
        <div style={{ padding: "10px 0", fontSize: "13px", color: "#666" }}>
          {["Health Insurance âœ“", "Dental Coverage âœ“", "Remote Work âœ“", "Annual Leave: 20 days"].map((b, i) => (
            <p key={i} style={{ margin: "0 0 6px" }}>{b}</p>
          ))}
        </div>
      )
    }
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: "20px",
      padding: "8px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
    }}>
      {sections.map((s, i) => (
        <div key={s.key} style={{
          borderBottom: i < sections.length - 1 ? "1px solid var(--lavender-100)" : "none"
        }}>
          <button
            onClick={() => setOpen(open === s.key ? null : s.key)}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "14px 0",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: "500", color: "var(--ink)"
            }}
          >
            {s.label}
            <span style={{
              transform: open === s.key ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s", fontSize: "12px", color: "#aaa"
            }}>
              â–¾
            </span>
          </button>
          {open === s.key && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {s.content}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// â”€â”€ Employee Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function EmployeeTable({ employees, onInvite }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: "#fff", borderRadius: "20px",
        padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        flex: 1
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "14px"
      }}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>
          Recent Employees
        </h3>
        <button
          onClick={onInvite}
          style={{
            padding: "7px 16px", borderRadius: "999px",
            background: "var(--purple-700)", color: "#fff",
            border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "500"
          }}
        >
          + Invite
        </button>
      </div>

      {employees.length === 0 ? (
        <p style={{ textAlign: "center", color: "#bbb", fontSize: "13px", padding: "20px 0" }}>
          No employees yet. Invite someone!
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Department", "Status"].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "6px 10px",
                  fontSize: "11px", color: "#bbb",
                  fontWeight: "500", borderBottom: "1px solid var(--lavender-100)"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td style={{ padding: "10px", fontSize: "13px", color: "var(--ink)" }}>
                  {emp.firstName} {emp.lastName}
                </td>
                <td style={{ padding: "10px", fontSize: "12px", color: "#888" }}>
                  {emp.department || "â€”"}
                </td>
                <td style={{ padding: "10px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "999px", fontSize: "11px",
                    background: emp.isPasswordChanged ? "#f0fdf4" : "#fff7ed",
                    color: emp.isPasswordChanged ? "#15803d" : "#c2410c"
                  }}>
                    {emp.isPasswordChanged ? "Active" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}

