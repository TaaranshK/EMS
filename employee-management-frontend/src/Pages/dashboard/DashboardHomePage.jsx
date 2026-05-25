import { Navigate } from "react-router-dom";
import SuperAdminDashboard from "./SuperAdminDashboard";
import EmployeeDashboardPage from "./employee/EmployeeDashboardPage";
import { getStoredRole } from "../../utils/authStorage";

export default function DashboardHomePage() {
  const role = getStoredRole();

  if (role === "Employee") {
    return <EmployeeDashboardPage />;
  }

  if (role === "SuperAdmin") {
    return <SuperAdminDashboard />;
  }

  return <Navigate to="/login" replace />;
}
