import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import { getStoredToken } from "../../../utils/authStorage";
import Card from "../../../Components/dashboard/Card";
import PageSeo from "../../../Components/seo/PageSeo";

export default function MyTasksPage() {
  const { tasks, setTasks, taskSummary, setTaskSummary } = useOutletContext();
  const [isLoading, setIsLoading] = useState(true);

  const token = getStoredToken();
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const loadInitialTasks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/onboarding-tasks/my-tasks`, { headers });
        const data = await res.json();
        setTasks(data?.tasks || []);
        setTaskSummary({
          total: data?.total ?? 0,
          completed: data?.completed ?? 0,
          progress: data?.progress ?? 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialTasks();
  }, [headers, setTaskSummary, setTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/onboarding-tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks((prev) => {
        const nextTasks = prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        const completed = nextTasks.filter((task) => task.status === "Completed").length;
        const total = nextTasks.length;
        const progress = total ? Math.round((completed / total) * 100) : 0;
        setTaskSummary({ total, completed, progress });
        return nextTasks;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = {
    Completed: { bg: "#f0fdf4", color: "#15803d" },
    InProgress: { bg: "#fff7ed", color: "#c2410c" },
    Pending: { bg: "#fef2f2", color: "#dc2626" },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PageSeo
        title="My Tasks"
        description="Track and complete your onboarding tasks, progress, and assigned employee actions."
      />
      <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1a1a2e", marginBottom: "0.25rem" }}>My Onboarding Tasks</h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "2rem" }}>Complete all tasks to finish your onboarding journey.</p>

      <Card style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e", margin: 0 }}>Overall Progress</p>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "#7C3AED", margin: 0 }}>
            {taskSummary.completed}/{taskSummary.total} - {taskSummary.progress}%
          </p>
        </div>
        <div style={{ background: "#f3f0ff", borderRadius: "999px", height: "10px" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${taskSummary.progress}%` }}
            transition={{ duration: 0.8 }}
            style={{ background: "#7C3AED", borderRadius: "999px", height: "10px" }}
          />
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {isLoading ? (
          <p style={{ color: "#888", textAlign: "center" }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>No tasks found</p>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card style={{ padding: "16px 18px", borderLeft: `4px solid ${task.status === "Completed" ? "#15803d" : "#7C3AED"}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={task.status === "Completed"}
                      onChange={() =>
                        handleStatusChange(
                          task.id,
                          task.status === "Completed" ? "Pending" : "Completed"
                        )
                      }
                      style={{ width: "18px", height: "18px", accentColor: "#7C3AED", cursor: "pointer" }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "var(--ink)",
                          margin: 0,
                          textDecoration: task.status === "Completed" ? "line-through" : "none",
                          opacity: task.status === "Completed" ? 0.6 : 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={task.title}
                      >
                        {task.title}
                      </p>
                      {task.scheduledAt && (
                        <p style={{ fontSize: "12px", color: "#888", margin: "2px 0 0" }}>
                          {new Date(task.scheduledAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <select
                    value={task.status}
                    onChange={(event) => handleStatusChange(task.id, event.target.value)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: statusColor[task.status]?.bg,
                      color: statusColor[task.status]?.color,
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
