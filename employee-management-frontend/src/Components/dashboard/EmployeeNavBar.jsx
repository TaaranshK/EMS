import { MagnifyingGlass, Gear, SignOut } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/employee-dashboard/home" },
  { label: "My Profile", to: "/employee-dashboard/profile" },
  { label: "My Tasks", to: "/employee-dashboard/tasks" },
  { label: "Meetings", to: "/employee-dashboard/meetings" },
];

export default function EmployeeNavBar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = navLinks.find((l) => location.pathname.startsWith(l.to))?.label ?? "Dashboard";

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "12px",
        padding: "20px 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "#e2dfe9",
          borderRadius: "999px",
          padding: "6px",
        }}
      >
        {navLinks.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => navigate(link.to)}
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: active === link.label ? "600" : "400",
              background: active === link.label ? "#2d2d3a" : "transparent",
              color: active === link.label ? "#fff" : "#666",
              transition: "all 0.2s",
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginLeft: "auto",
        }}
      >
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "999px",
            border: "1px solid #ddd",
            background: "#fff",
            fontSize: "13px",
            cursor: "pointer",
            color: "#444",
          }}
        >
          <Gear size={14} /> Settings
        </button>

        <button
          type="button"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid #ddd",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Search"
        >
          <MagnifyingGlass size={15} color="#444" />
        </button>

        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid #ddd",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Logout"
        >
          <SignOut size={15} color="#444" />
        </button>
      </div>
    </nav>
  );
}
