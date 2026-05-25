import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNavBar from "../../Components/dashboard/DashboardNavBar";
import { API_BASE_URL } from "../../config/api";
import {
  clearAuthStorage,
  getStoredRole,
  getStoredToken,
} from "../../utils/authStorage";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const role = getStoredRole();
  const isEmployee = role === "Employee";
  const token = getStoredToken();

  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskSummary, setTaskSummary] = useState({ total: 0, completed: 0, progress: 0 });
  const [isLoading, setIsLoading] = useState(isEmployee);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  useEffect(() => {
    if (!isEmployee) {
      setIsLoading(false);
      setError("");
      return;
    }

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
        const tasksPayload = await tasksRes.json();

        if (!cancelled) {
          setEmployee(profile);
          setTasks(tasksPayload?.tasks ?? []);
          setTaskSummary({
            total: tasksPayload?.total ?? 0,
            completed: tasksPayload?.completed ?? 0,
            progress: tasksPayload?.progress ?? 0,
          });
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load your dashboard. Please refresh.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [headers, isEmployee, navigate]);

  const onLogout = () => {
    clearAuthStorage();
    navigate("/login", { replace: true });
  };

  const initials = employee
    ? `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase()
    : "E";

  return (
    <div style={{ minHeight: "100vh", background: "#eeecf3", fontFamily: "'Georgia', serif" }}>
      <DashboardNavBar role={role} onLogout={onLogout} />

      <main style={{ padding: "0 28px 32px" }}>
        {isEmployee ? (
          error ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "14px 16px",
                color: "#b91c1c",
                fontWeight: 600,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {error}
            </div>
          ) : isLoading ? (
            <div style={{ color: "#6b7280", padding: "10px 2px" }}>Loading...</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet
                context={{
                  employee,
                  setEmployee,
                  tasks,
                  setTasks,
                  taskSummary,
                  setTaskSummary,
                  initials,
                  reload: () => navigate(0),
                }}
              />
            </motion.div>
          )
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
