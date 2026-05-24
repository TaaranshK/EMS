import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const useChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from login page via navigate state, or deep link from invite email (?email=...)
  const queryEmail = new URLSearchParams(location.search).get("email") || "";
  const email = location.state?.email || queryEmail || "";

  const [formData, setFormData] = useState({
    temporaryPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showTemp, setShowTemp] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Missing email. Please open the change-password link from your invitation email, or log in first.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          temporaryPassword: formData.temporaryPassword,
          newPassword: formData.newPassword,
        }),
      });

      const raw = await response.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message =
          typeof data === "string"
            ? data
            : data?.message || data?.Message || raw || "Something went wrong";
        setError(message);
        return;
      }

      // After changing password, force a fresh login with the new password.
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setSuccess("Password changed successfully! Redirecting to login...");
      setTimeout(() => navigate(`/login?email=${encodeURIComponent(email)}`), 1500);

    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    formData,
    showTemp, setShowTemp,
    showNew, setShowNew,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
};

export default useChangePassword;
