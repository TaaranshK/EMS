import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarBlank,
  Clock,
  LinkSimple,
  Microphone,
  UploadSimple,
  Users,
  VideoCamera,
} from "@phosphor-icons/react";
import {
  getEmployees,
  getMeetingsForDate,
  getRecentMeetings,
  scheduleMeeting,
} from "../../services/Dashboard";
import PageSeo from "../../Components/seo/PageSeo";

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const formatRange = (date) => {
  const start = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const end = new Date(date.getTime() + 45 * 60 * 1000).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${start} – ${end}`;
};

const extractMeetingUrl = (description) => {
  if (!description) return "";
  const firstLine = String(description).split("\n")[0] ?? "";
  const prefix = "MEETING_URL:";
  if (!firstLine.startsWith(prefix)) return "";
  return firstLine.slice(prefix.length).trim();
};

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState("Online");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [scheduledAtLocal, setScheduledAtLocal] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [todayItems, setTodayItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busySchedule, setBusySchedule] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const load = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError("");
    try {
      const [empRes, todayRes, recentRes] = await Promise.all([
        getEmployees({ page: 1, pageSize: 250, sortBy: "createdAt", sortOrder: "desc" }),
        getMeetingsForDate(todayStr),
        getRecentMeetings(12),
      ]);
      setEmployees(empRes.data || []);
      setTodayItems(todayRes.items || []);
      setRecentItems(recentRes.items || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialMeetings = async () => {
      setError("");
      try {
        const [empRes, todayRes, recentRes] = await Promise.all([
          getEmployees({ page: 1, pageSize: 250, sortBy: "createdAt", sortOrder: "desc" }),
          getMeetingsForDate(todayStr),
          getRecentMeetings(12),
        ]);
        setEmployees(empRes.data || []);
        setTodayItems(todayRes.items || []);
        setRecentItems(recentRes.items || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load meetings.");
      } finally {
        setLoading(false);
      }
    };

    void loadInitialMeetings();
  }, [todayStr]);

  const filteredRecent = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recentItems;
    return recentItems.filter((m) => {
      const title = String(m.title || "").toLowerCase();
      const emp = `${m.employee?.firstName || ""} ${m.employee?.lastName || ""}`.toLowerCase();
      return title.includes(q) || emp.includes(q);
    });
  }, [recentItems, search]);

  const canSchedule =
    isValidUrl(meetingUrl) && scheduledAtLocal && selectedEmployeeIds.length > 0 && !busySchedule;

  const toggleEmployee = (id) => {
    setSelectedEmployeeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const onSchedule = async () => {
    if (!canSchedule) return;
    setBusySchedule(true);
    setStatusMessage("");
    setError("");
    try {
      const scheduledAt = new Date(scheduledAtLocal);
      const payload = {
        meetingUrl,
        title: meetingTitle || "Team Sync",
        scheduledAt: scheduledAt.toISOString(),
        mode: activeTab,
        employeeIds: selectedEmployeeIds,
      };
      const res = await scheduleMeeting(payload);
      setStatusMessage(`Scheduled. Invited: ${res.invited}.`);
      setMeetingUrl("");
      setMeetingTitle("");
      setScheduledAtLocal("");
      setSelectedEmployeeIds([]);
      await load();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Scheduling failed.");
    } finally {
      setBusySchedule(false);
    }
  };

  const shellBg = "radial-gradient(1200px 700px at 15% 10%, rgba(255,255,255,0.9), rgba(124,58,237,0.10) 40%, rgba(255,255,255,0.7) 80%)";

  return (
    <div style={{ padding: "18px 22px" }}>
      <PageSeo
        title="Meetings"
        description="Schedule employee meetings, review upcoming sessions, and monitor recent meeting activity from the admin workspace."
      />
      {/* Top bar */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(17, 24, 39, 0.06)",
              borderRadius: "18px",
              padding: "10px 12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ width: 32, height: 32, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.10)" }}>
              <LinkSimple size={16} color="#4a4a5a" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find any meeting moment..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "13px",
                color: "#444",
              }}
            />
            <span style={{ fontSize: "11px", color: "#888", background: "rgba(0,0,0,0.04)", padding: "6px 10px", borderRadius: 12 }}>
              Cmd + K
            </span>
          </div>
        </div>
      </div>

      {error && <p style={{ margin: "0 0 10px", color: "#b91c1c", fontSize: "13px" }}>{error}</p>}
      {statusMessage && <p style={{ margin: "0 0 10px", color: "#15803d", fontSize: "13px" }}>{statusMessage}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.55fr 0.85fr",
          gap: "18px",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <h2 style={{ margin: "0 0 10px", fontSize: "26px", fontWeight: 800, color: "#111827" }}>New meeting</h2>

          <div
            style={{
              background: shellBg,
              borderRadius: "22px",
              padding: "16px",
              border: "1px solid rgba(17, 24, 39, 0.06)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.65)", borderRadius: 16, padding: 6, border: "1px solid rgba(17, 24, 39, 0.06)" }}>
              {[
                { key: "Online", label: "Online meeting", icon: VideoCamera },
                { key: "In-person", label: "In-person meeting", icon: Microphone },
                { key: "Upload", label: "Upload meeting", icon: UploadSimple },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 10px",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      background: isActive ? "rgba(124,58,237,0.15)" : "transparent",
                      color: isActive ? "#5b21b6" : "#555",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    <Icon size={16} color={isActive ? "#5b21b6" : "#777"} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* URL + schedule */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: "12px", marginTop: "12px" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.75)",
                  borderRadius: "18px",
                  border: "1px solid rgba(17, 24, 39, 0.06)",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <LinkSimple size={16} color="#7C3AED" />
                <input
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="Paste your meeting URL here"
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "13px" }}
                />
              </div>

              <button
                type="button"
                disabled={!canSchedule}
                onClick={onSchedule}
                style={{
                  border: "none",
                  borderRadius: "18px",
                  cursor: canSchedule ? "pointer" : "not-allowed",
                  background: canSchedule ? "linear-gradient(135deg, #7C3AED, #4a4a5a)" : "rgba(124,58,237,0.15)",
                  color: canSchedule ? "#fff" : "#6b5b7e",
                  fontWeight: 800,
                  fontSize: "13px",
                  boxShadow: canSchedule ? "0 14px 40px rgba(124,58,237,0.28)" : "none",
                }}
              >
                {busySchedule ? "Scheduling..." : "Schedule"}
              </button>
            </div>

            {/* Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px", marginTop: "12px" }}>
              <div>
                <p style={{ margin: "10px 0 6px", fontSize: "11px", color: "#777", fontWeight: 700 }}>
                  Name your meeting (optional)
                </p>
                <input
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="E.g. Team Sync"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(17, 24, 39, 0.06)",
                    background: "rgba(255,255,255,0.80)",
                    outline: "none",
                    fontSize: "13px",
                  }}
                />
              </div>
              <div>
                <p style={{ margin: "10px 0 6px", fontSize: "11px", color: "#777", fontWeight: 700 }}>
                  When
                </p>
                <input
                  type="datetime-local"
                  value={scheduledAtLocal}
                  onChange={(e) => setScheduledAtLocal(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(17, 24, 39, 0.06)",
                    background: "rgba(255,255,255,0.80)",
                    outline: "none",
                    fontSize: "13px",
                  }}
                />
              </div>
            </div>

            {/* Invitees */}
            <div style={{ marginTop: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ margin: "10px 0 6px", fontSize: "11px", color: "#777", fontWeight: 800 }}>
                  Invite employees
                </p>
                <p style={{ margin: "10px 0 6px", fontSize: "11px", color: "#888" }}>
                  Selected: {selectedEmployeeIds.length}
                </p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(17, 24, 39, 0.06)",
                  borderRadius: "18px",
                  padding: "10px",
                  maxHeight: "180px",
                  overflow: "auto",
                }}
              >
                {loading ? (
                  <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Loading…</p>
                ) : employees.length === 0 ? (
                  <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>No employees found.</p>
                ) : (
                  employees.slice(0, 60).map((e) => {
                    const checked = selectedEmployeeIds.includes(e.id);
                    return (
                      <label
                        key={e.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          padding: "10px 10px",
                          borderRadius: "14px",
                          cursor: "pointer",
                          background: checked ? "rgba(124,58,237,0.10)" : "transparent",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input type="checkbox" checked={checked} onChange={() => toggleEmployee(e.id)} />
                          <span>
                            <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1a1a2e" }}>
                              {e.firstName} {e.lastName}
                            </span>
                            <span style={{ display: "block", fontSize: "11px", color: "#888" }}>{e.email}</span>
                          </span>
                        </span>
                        <span style={{ fontSize: "11px", color: "#888" }}>{e.department || "—"}</span>
                      </label>
                    );
                  })
                )}
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#888" }}>
                Schedule becomes enabled when a valid URL is pasted, a time is selected, and at least 1 employee is checked.
              </p>
            </div>
          </div>

          {/* Recent */}
          <div style={{ marginTop: "18px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#111827" }}>Recent meetings</h2>
            <span style={{ fontSize: "12px", color: "#7C3AED", fontWeight: 800 }}>Go to Meetings</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "12px" }}>
            {(loading ? [] : filteredRecent).slice(0, 6).map((m) => {
              const when = m.scheduledAt ? new Date(m.scheduledAt) : null;
              const url = extractMeetingUrl(m.description);
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(17, 24, 39, 0.06)",
                    borderRadius: "22px",
                    padding: "16px",
                    boxShadow: "0 18px 60px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 900, color: "#111827" }}>{m.title}</p>
                      <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#888" }}>
                        {when ? when.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "—"}{" "}
                        {when ? `• ${formatRange(when)}` : ""}
                      </p>
                    </div>
                    <span style={{ fontSize: "12px", color: "#aaa" }}>…</span>
                  </div>

                  <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#666", lineHeight: 1.4 }}>
                    Invited: {m.employee?.firstName} {m.employee?.lastName}
                  </p>

                  {url && (
                    <a href={url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "10px", fontSize: "12px", color: "#5b21b6", fontWeight: 800, textDecoration: "none" }}>
                      Open link
                    </a>
                  )}
                </motion.div>
              );
            })}
            {!loading && filteredRecent.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(17, 24, 39, 0.06)",
                  borderRadius: "22px",
                  padding: "16px",
                  color: "#888",
                  fontSize: "13px",
                }}
              >
                No meetings yet. Schedule one to see it here.
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ position: "sticky", top: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(17, 24, 39, 0.06)",
              borderRadius: "22px",
              padding: "16px",
              boxShadow: "0 18px 60px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#111827" }}>Today</h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>{new Date().toLocaleDateString()}</p>
              </div>
              <span style={{ width: 34, height: 34, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.10)" }}>
                <CalendarBlank size={16} color="#5b21b6" />
              </span>
            </div>

            <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 900, color: "#111827" }}>Meetings</p>
              <span style={{ fontSize: "12px", color: "#777", background: "rgba(0,0,0,0.04)", padding: "6px 10px", borderRadius: 12 }}>
                Capture all
              </span>
            </div>

            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {loading ? (
                <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Loading…</p>
              ) : todayItems.length === 0 ? (
                <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>No meetings scheduled for today.</p>
              ) : (
                todayItems.slice(0, 6).map((m) => {
                  const when = m.scheduledAt ? new Date(m.scheduledAt) : null;
                  const url = extractMeetingUrl(m.description);
                  return (
                    <div
                      key={m.id}
                      style={{
                        border: "1px solid rgba(17, 24, 39, 0.06)",
                        borderRadius: "18px",
                        background: "rgba(255,255,255,0.70)",
                        padding: "12px 12px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 900, color: "#111827" }}>{m.title}</p>
                        <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#888", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Clock size={14} color="#7C3AED" />
                          {when ? formatRange(when) : "—"}
                        </p>
                        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#666" }}>
                          {m.employee?.firstName} {m.employee?.lastName}
                        </p>
                      </div>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 10px",
                            borderRadius: "14px",
                            background: "rgba(124,58,237,0.12)",
                            color: "#5b21b6",
                            fontWeight: 900,
                            fontSize: "12px",
                          }}
                        >
                          <Users size={14} /> Join
                        </a>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            width: "42px",
                            height: "24px",
                            borderRadius: "999px",
                            background: "rgba(124,58,237,0.22)",
                          }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
