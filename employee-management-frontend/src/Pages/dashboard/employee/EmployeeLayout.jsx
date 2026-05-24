import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../../config/api";
import { clearAuthStorage, getStoredToken } from "../../../utils/authStorage";
import EmployeeNavBar from "../../../Components/dashboard/EmployeeNavBar";

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskSummary, setTaskSummary] = useState({ total: 0, completed: 0, progress: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getStoredToken();

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [profileRes, tasksRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile/me`, { headers }),
          fetch(`${API_BASE_URL}/onboarding-tasks/my-tasks`, { headers }),
        ]);

        if (profileRes.status === 401 || profileRes.status === 403) {
          clearAuthStorage();
          navigate("/login", { replace: true });
          return;
        }

        const profile = await profileRes.json();
        const tasks = await tasksRes.json();

        if (!cancelled) {
          setEmployee(profile);
          setTasks(tasks?.tasks ?? []);
          setTaskSummary({
            total: tasks?.total ?? 0,
            completed: tasks?.completed ?? 0,
            progress: tasks?.progress ?? 0,
          });
        }
      } catch {
        if (!cancelled) setError("Failed to load your dashboard. Please refresh.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [headers, navigate]);

  const initials = employee
    ? `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase()
    : "E";

  const onLogout = () => {
    clearAuthStorage();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eeecf3", fontFamily: "'Georgia', serif" }}>
      <EmployeeNavBar onLogout={onLogout} />

      <main style={{ padding: "0 28px 32px" }}>
        {error ? (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "14px 16px", color: "#b91c1c", fontWeight: 600, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {error}
          </div>
        ) : isLoading ? (
          <div style={{ color: "#6b7280", padding: "10px 2px" }}>Loading...</div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Outlet context={{ employee, setEmployee, tasks, setTasks, taskSummary, setTaskSummary, initials, reload: () => navigate(0) }} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
