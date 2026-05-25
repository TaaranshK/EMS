import { Gear, MagnifyingGlass, SignOut } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import { dashboardNavigation } from "./dashboardNavigation";

function getActiveLabel(pathname, links) {
  const activeLink = [...links]
    .sort((left, right) => right.to.length - left.to.length)
    .find((link) => pathname === link.to || pathname.startsWith(`${link.to}/`));

  return activeLink?.label ?? links[0]?.label ?? "Dashboard";
}

export default function DashboardNavBar({ role, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = dashboardNavigation[role] ?? dashboardNavigation.Employee;
  const active = getActiveLabel(location.pathname, links);
  const isEmployee = role === "Employee";

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: isEmployee ? "wrap" : "nowrap",
        gap: isEmployee ? "12px" : "0",
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
        {links.map((link) => (
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
          position: isEmployee ? "static" : "absolute",
          right: isEmployee ? "auto" : "32px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginLeft: isEmployee ? "auto" : 0,
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
          aria-label="Search"
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
          aria-label="Logout"
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
