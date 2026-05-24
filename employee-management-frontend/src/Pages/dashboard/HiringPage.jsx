import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  inviteBulkEmployees,
  getEmployees,
  getOnboardingTasksByEmployee,
} from "../../services/Dashboard";
import { Users, UserPlus, ClipboardText, UploadSimple, X } from "@phosphor-icons/react";

export default function HiringPage({ onInvite }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [tasksData, setTasksData] = useState(null);

  const loadEmployees = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError("");
    try {
      const res = await getEmployees({ page: 1, pageSize: 100, sortBy: "createdAt", sortOrder: "desc" });
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialEmployees = async () => {
      setError("");
      try {
        const res = await getEmployees({ page: 1, pageSize: 100, sortBy: "createdAt", sortOrder: "desc" });
        setEmployees(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    void loadInitialEmployees();
  }, []);

  const { pendingEmployees, activeEmployees } = useMemo(() => {
    const pending = employees.filter((e) => !e.isPasswordChanged);
    const active = employees.filter((e) => e.isPasswordChanged);
    return { pendingEmployees: pending, activeEmployees: active };
  }, [employees]);

  const statCards = [
    {
      label: "Total Employees",
      value: employees.length,
      sub: "In directory",
      icon: <Users size={20} color="#fff" />,
      bg: "#2d2d3a",
    },
    {
      label: "Pending Onboarding",
      value: pendingEmployees.length,
      sub: "Invited, not active",
      icon: <ClipboardText size={20} color="#fff" />,
      bg: "#7C3AED",
    },
    {
      label: "Active Employees",
      value: activeEmployees.length,
      sub: "Password changed",
      icon: <Users size={20} color="#fff" />,
      bg: "#4a4a5a",
    },
  ];

  const handleBulkInvite = async () => {
    if (!bulkFile) return;
    setBulkBusy(true);
    setBulkResults([]);
    setError("");
    try {
      const res = await inviteBulkEmployees(bulkFile);
      setBulkResults(res.Results || []);
      await loadEmployees();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Bulk invite failed.");
    } finally {
      setBulkBusy(false);
    }
  };

  const openEmployeeTasks = async (emp) => {
    setSelectedEmployee(emp);
    setTasksData(null);
    setTasksError("");
    setTasksLoading(true);
    try {
      const res = await getOnboardingTasksByEmployee(emp.id);
      setTasksData(res);
    } catch (err) {
      console.error(err);
      setTasksError(err instanceof Error ? err.message : "Failed to load onboarding tasks.");
    } finally {
      setTasksLoading(false);
    }
  };

  const closeTasks = () => {
    setSelectedEmployee(null);
    setTasksData(null);
    setTasksError("");
    setTasksLoading(false);
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>Hiring</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#aaa" }}>
            Invite employees and track onboarding progress
          </p>
          {error && <p style={{ margin: "10px 0 0", color: "#b91c1c", fontSize: "13px" }}>{error}</p>}
        </div>

        <button
          type="button"
          onClick={onInvite}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "999px",
            background: "#2d2d3a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            height: "40px",
            flexShrink: 0,
          }}
        >
          <UserPlus size={16} color="#fff" /> Invite Employee
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "22px" }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ background: "#fff", borderRadius: "20px", padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              {card.icon}
            </div>
            <p style={{ margin: "0 0 2px", fontSize: "24px", fontWeight: "800", color: "#1a1a2e" }}>{card.value}</p>
            <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "600", color: "#555" }}>{card.label}</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Bulk invite */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "18px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginTop: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>Bulk Invite</h3>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>
              Upload an Excel file to invite multiple employees at once
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
              style={{ fontSize: "12px" }}
            />
            <button
              type="button"
              disabled={!bulkFile || bulkBusy}
              onClick={handleBulkInvite}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 14px",
                borderRadius: "999px",
                background: !bulkFile || bulkBusy ? "#e5e0ef" : "#7C3AED",
                color: !bulkFile || bulkBusy ? "#777" : "#fff",
                border: "none",
                cursor: !bulkFile || bulkBusy ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              <UploadSimple size={15} color={!bulkFile || bulkBusy ? "#777" : "#fff"} />
              {bulkBusy ? "Uploading..." : "Upload & Invite"}
            </button>
          </div>
        </div>

        {bulkResults.length > 0 && (
          <div style={{ marginTop: "14px", background: "#faf8ff", border: "1px solid #eee", borderRadius: "14px", padding: "12px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "#333" }}>Results</p>
            <div style={{ maxHeight: "160px", overflow: "auto" }}>
              {bulkResults.map((line, i) => (
                <p key={i} style={{ margin: "0 0 6px", fontSize: "12px", color: "#666" }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Pending onboarding list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
          marginTop: "16px",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0eef5", display: "flex", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>Pending Onboarding</h3>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>
              Employees who haven’t completed their first login/password change
            </p>
          </div>
          <button
            type="button"
            onClick={loadEmployees}
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              border: "1px solid #eee",
              background: "#fff",
              cursor: "pointer",
              fontSize: "12px",
              color: "#444",
              height: "36px",
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "26px 20px", color: "#888", fontSize: "13px" }}>Loading employees…</div>
        ) : pendingEmployees.length === 0 ? (
          <div style={{ padding: "26px 20px", color: "#888", fontSize: "13px" }}>No pending employees.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9f8fc" }}>
                {["Employee", "Department", "Job Title", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 20px",
                      fontSize: "11px",
                      color: "#aaa",
                      fontWeight: "700",
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #f0eef5",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingEmployees.slice(0, 10).map((emp) => (
                <tr key={emp.id} style={{ borderBottom: "1px solid #f9f8fc" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #7C3AED, #4a4a5a)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "800",
                          flexShrink: 0,
                        }}
                      >
                        {emp.firstName?.[0]}
                        {emp.lastName?.[0]}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#888" }}>{emp.department || "—"}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#888" }}>{emp.jobTitle || "—"}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: "#fff7ed",
                        color: "#c2410c",
                      }}
                    >
                      Pending
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button
                      type="button"
                      onClick={() => openEmployeeTasks(emp)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "12px",
                        border: "1px solid #eee",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#444",
                      }}
                    >
                      View onboarding
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "18px",
            }}
            onClick={closeTasks}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(820px, 96vw)",
                background: "#fff",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow: "0 30px 100px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0eef5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>Onboarding</p>
                  <h3 style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: "800", color: "#1a1a2e" }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeTasks}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    border: "1px solid #eee",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={16} color="#444" />
                </button>
              </div>

              <div style={{ padding: "18px 20px" }}>
                {tasksLoading ? (
                  <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Loading tasks…</p>
                ) : tasksError ? (
                  <p style={{ margin: 0, fontSize: "13px", color: "#b91c1c" }}>{tasksError}</p>
                ) : tasksData ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1a1a2e" }}>
                        Progress: {tasksData.completed}/{tasksData.total} ({tasksData.progress}%)
                      </p>
                      <span style={{ fontSize: "12px", color: "#888" }}>{selectedEmployee.email}</span>
                    </div>

                    <div style={{ height: "10px", background: "#f0eef5", borderRadius: "999px", overflow: "hidden", marginBottom: "14px" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.max(0, Math.min(100, tasksData.progress ?? 0))}%`,
                          background: "linear-gradient(90deg, #7C3AED, #4a4a5a)",
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {(tasksData.tasks || []).map((t) => (
                        <div
                          key={t.id}
                          style={{
                            border: "1px solid #f0eef5",
                            borderRadius: "16px",
                            padding: "12px",
                            background: "#fff",
                          }}
                        >
                          <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "800", color: "#1a1a2e" }}>{t.title}</p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{t.description}</p>
                          <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#aaa" }}>
                            Status: <span style={{ color: "#444", fontWeight: "700" }}>{t.status}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>No data.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
