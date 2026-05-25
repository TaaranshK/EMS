import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/auth/LoginPage";
import ChangePasswordPage from "./Pages/auth/ChangePasswordPage";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import DashboardLayout from "./Pages/dashboard/DashboardLayout";
import DashboardHomePage from "./Pages/dashboard/DashboardHomePage";
import EmployeesPage from "./Pages/dashboard/EmployeesPage";
import HiringPage from "./Pages/dashboard/HiringPage";
import ComingSoonPage from "./Pages/dashboard/ComingSoonPage";
import PayrollPage from "./Pages/dashboard/PayrollPage";
import AdminSectionPage from "./Pages/dashboard/AdminSectionPage";
import AdminMeetingsPage from "./Pages/dashboard/MeetingsPage";
import MyProfilePage from "./Pages/dashboard/employee/MyProfilePage";
import MyTasksPage from "./Pages/dashboard/employee/MyTasksPage";
import EmployeeMeetingsPage from "./Pages/dashboard/employee/MeetingsPage";
import { getStoredRole } from "./utils/authStorage";

function DashboardMeetingsPage() {
  return getStoredRole() === "Employee" ? <EmployeeMeetingsPage /> : <AdminMeetingsPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["SuperAdmin", "Employee"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route
              path="employees"
              element={
                <ProtectedRoute role="SuperAdmin" redirectTo="/dashboard">
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="hiring"
              element={
                <ProtectedRoute role="SuperAdmin" redirectTo="/dashboard">
                  <HiringPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="devices"
              element={
                <ProtectedRoute role="SuperAdmin" redirectTo="/dashboard">
                  <ComingSoonPage pageName="Devices" />
                </ProtectedRoute>
              }
            />
            <Route
              path="payroll"
              element={
                <ProtectedRoute role="SuperAdmin" redirectTo="/dashboard">
                  <PayrollPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reviews"
              element={
                <ProtectedRoute role="SuperAdmin" redirectTo="/dashboard">
                  <AdminSectionPage title="Reviews" />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute role="Employee" redirectTo="/dashboard">
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tasks"
              element={
                <ProtectedRoute role="Employee" redirectTo="/dashboard">
                  <MyTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="meetings"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin", "Employee"]} redirectTo="/dashboard">
                  <DashboardMeetingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="/admin-dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin-employees" element={<Navigate to="/dashboard/employees" replace />} />
          <Route path="/admin-hiring" element={<Navigate to="/dashboard/hiring" replace />} />
          <Route path="/admin-devices" element={<Navigate to="/dashboard/devices" replace />} />
          <Route path="/admin-payroll" element={<Navigate to="/dashboard/payroll" replace />} />
          <Route path="/admin-reviews" element={<Navigate to="/dashboard/reviews" replace />} />
          <Route path="/employee-dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/employee-dashboard/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="/employee-dashboard/profile" element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="/employee-dashboard/tasks" element={<Navigate to="/dashboard/tasks" replace />} />
          <Route path="/employee-dashboard/meetings" element={<Navigate to="/dashboard/meetings" replace />} />
          <Route path="/employee-profile" element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="/employee-tasks" element={<Navigate to="/dashboard/tasks" replace />} />
          <Route path="/employee-meetings" element={<Navigate to="/dashboard/meetings" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
