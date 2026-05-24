import NavBar from "../../Components/dashboard/NavBar";
import { clearAuthStorage } from "../../utils/authStorage";

export default function AdminSectionPage({ title }) {
  const handleLogout = () => {
    clearAuthStorage();
    window.location.href = "/login";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--lavender-50)", fontFamily: "Poppins, sans-serif" }}>
      <NavBar active={title} onLogout={handleLogout} />
      <div style={{ padding: "24px 32px" }}>
        <h2 style={{ margin: 0, color: "var(--ink)" }}>{title}</h2>
        <p style={{ marginTop: 8, color: "var(--muted)" }}>This section is not implemented yet.</p>
      </div>
    </div>
  );
}

