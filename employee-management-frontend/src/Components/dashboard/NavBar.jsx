import { MagnifyingGlass, Gear, SignOut } from "@phosphor-icons/react";

const navLinks = ["Dashboard", "Employees", "Hiring", "Devices", "Payroll", "Meetings"];

export default function Navbar({ active = "Dashboard", onNavigate, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 32px",
        position: "relative",
      }}
    >
      {/* Center Links */}
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
            key={link}
            type="button"
            onClick={() => onNavigate?.(link)}
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: active === link ? "600" : "400",
              background: active === link ? "#2d2d3a" : "transparent",
              color: active === link ? "#fff" : "#666",
              transition: "all 0.2s",
            }}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Right Side */}
      <div
        style={{
          position: "absolute",
          right: "32px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
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
        >
          <SignOut size={15} color="#444" />
        </button>
      </div>
    </nav>
  );
}
