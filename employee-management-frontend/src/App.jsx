import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LoginPage from "./Pages/auth/LoginPage";
import ChangePasswordPage from "./Pages/auth/ChangePasswordPage";
import SuperAdminDashboard from "./Pages/dashboard/SuperAdminDashboard";
import EmployeeDashboard from "./Pages/dashboard/employee/EmployeeDashboardPage";
import EmployeeLayout from "./Pages/dashboard/employee/EmployeeLayout";
import MyProfilePage from "./Pages/dashboard/employee/MyProfilePage";
import MyTasksPage from "./Pages/dashboard/employee/MyTasksPage";
import MeetingsPage from "./Pages/dashboard/employee/MeetingsPage";
import AdminSectionPage from "./Pages/dashboard/AdminSectionPage";
import ProtectedRoute from "./Components/auth/ProtectedRoute";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* SuperAdmin Only */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="SuperAdmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-employees"
            element={
              <ProtectedRoute role="SuperAdmin">
                <AdminSectionPage title="Employees" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-hiring"
            element={
              <ProtectedRoute role="SuperAdmin">
                <AdminSectionPage title="Hiring" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-devices"
            element={
              <ProtectedRoute role="SuperAdmin">
                <AdminSectionPage title="Devices" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-payroll"
            element={
              <ProtectedRoute role="SuperAdmin">
                <AdminSectionPage title="PayRoll" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-reviews"
            element={
              <ProtectedRoute role="SuperAdmin">
                <AdminSectionPage title="Reviews" />
              </ProtectedRoute>
            }
          />

          {/* Employee Only */}
          <Route
            path="/employee-dashboard"
            element={<Navigate to="/employee-dashboard/home" replace />}
          />
          <Route
            path="/employee-dashboard/*"
            element={
              <ProtectedRoute role="Employee">
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<EmployeeDashboard />} />
            <Route path="profile" element={<MyProfilePage />} />
            <Route path="tasks" element={<MyTasksPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="*" element={<Navigate to="/employee-dashboard/home" replace />} />
          </Route>

          {/* Friendly aliases for navbar links */}
          <Route path="/employee-profile" element={<Navigate to="/employee-dashboard/profile" replace />} />
          <Route path="/employee-tasks" element={<Navigate to="/employee-dashboard/tasks" replace />} />
          <Route path="/employee-meetings" element={<Navigate to="/employee-dashboard/meetings" replace />} />

        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
