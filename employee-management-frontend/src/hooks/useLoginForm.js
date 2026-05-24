import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginEmployee, loginSuperAdmin } from "../services/authServics";
import { getRoleFromToken } from "../utils/jwt";

const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryEmail = new URLSearchParams(location.search).get("email") || "";
  const [formData, setFormData] = useState({ email: queryEmail, password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("employee");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Pick API based on role
      const response =
        role === "superadmin"
          ? await loginSuperAdmin(formData)
          : await loginEmployee(formData);

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "string"
            ? data
            : data?.message || data?.Message || "Invalid email or password";
        setError(message);
        return;
      }

      // Employee first login → go to change password
      const requiresPasswordChange =
        typeof data === "object" && data
          ? (data.RequiresPasswordChange ?? data.requiresPasswordChange)
          : false;

      if (requiresPasswordChange) {
        navigate("/change-password", { state: { email: formData.email } });
        return;
      }

      // Save token and redirect
      const token =
        typeof data === "object" && data
          ? (data.Token ?? data.token ?? data.accessToken ?? data.jwt)
          : null;

      if (!token) {
        const debug =
          typeof data === "string" ? data : data ? JSON.stringify(data) : "";
        setError(
          `Login succeeded but no token was returned.${debug ? ` Response: ${debug}` : ""}`
        );
        return;
      }

      localStorage.setItem("token", token);
      const fallbackRole = role === "superadmin" ? "SuperAdmin" : "Employee";
      const tokenRole = getRoleFromToken(token) || fallbackRole;
      localStorage.setItem("role", tokenRole);

      navigate(tokenRole === "SuperAdmin" ? "/admin-dashboard" : "/employee-dashboard");

    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    role,
    setRole,
    handleChange,
    handleSubmit,
  };
};

export default useLoginForm;
