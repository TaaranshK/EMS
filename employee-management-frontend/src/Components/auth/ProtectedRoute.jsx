import { Navigate } from "react-router-dom";
import { clearAuthStorage, getStoredToken } from "../../utils/authStorage";

export default function ProtectedRoute({ children, allowedRoles, role: requiredRole }) {
  const token = getStoredToken();
  const storedRole = localStorage.getItem("role");

  if (!token) {
    clearAuthStorage();
    return <Navigate to="/login" replace />;
  }

  const rolesToAllow =
    Array.isArray(allowedRoles) && allowedRoles.length > 0
      ? allowedRoles
      : typeof requiredRole === "string" && requiredRole
        ? [requiredRole]
        : [];

  if (rolesToAllow.length > 0) {
    if (!storedRole || !rolesToAllow.includes(storedRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
