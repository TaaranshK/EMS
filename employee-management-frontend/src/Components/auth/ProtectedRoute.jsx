import { Navigate } from "react-router-dom";
import {
  clearAuthStorage,
  getStoredRole,
  getStoredToken,
} from "../../utils/authStorage";

export default function ProtectedRoute({
  children,
  allowedRoles,
  role: requiredRole,
  redirectTo = "/login",
}) {
  const token = getStoredToken();
  const storedRole = getStoredRole();

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
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}
