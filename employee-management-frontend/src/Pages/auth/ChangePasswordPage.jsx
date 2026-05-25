import { motion } from "framer-motion";
import InputField from "../../Components/auth/InputField";
import useChangePassword from "../../hooks/useChangePassword";
import PageSeo from "../../Components/seo/PageSeo";

export default function ChangePasswordPage() {
  const {
    email,
    formData,
    showTemp, setShowTemp,
    showNew, setShowNew,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
  } = useChangePassword();

  return (
    <>
      <PageSeo
        title="Change Password"
        description="Update your temporary password to activate secure access to the Employee Management System."
      />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ece9f1 0%, #f5f3ee 40%, #e8e4f0 100%)",
        }}
      >
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "3rem",
            width: "100%",
            maxWidth: "460px",
            boxShadow: "0 8px 40px rgba(124,58,237,0.10)",
          }}
        >
          {/* Logo */}
          <header style={{ marginBottom: "2rem" }}>
            <span
              style={{
                border: "1.5px solid #ccc",
                borderRadius: "999px",
                padding: "6px 18px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#444",
              }}
            >
              EMS
            </span>
          </header>

          {/* Heading */}
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1a1a2e", marginBottom: "8px" }}>
            Set new password
          </h1>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "0.5rem" }}>
            Enter your temporary password and choose a new one
          </p>

          {/* Show email for context */}
          <p style={{
            fontSize: "13px", color: "#7C3AED", fontWeight: "500",
            marginBottom: "2rem", backgroundColor: "#f3f0ff",
            padding: "8px 14px", borderRadius: "999px", display: "inline-block"
          }}>
            {email}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Temporary Password"
              id="temporaryPassword"
              type={showTemp ? "text" : "password"}
              name="temporaryPassword"
              value={formData.temporaryPassword}
              onChange={handleChange}
              placeholder="Enter temporary password"
              showToggle={true}
              onToggle={() => setShowTemp(!showTemp)}
            />

            <InputField
              label="New Password"
              id="newPassword"
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              showToggle={true}
              onToggle={() => setShowNew(!showNew)}
            />

            <InputField
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}
              >
                {error}
              </motion.p>
            )}

            {/* Success */}
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: "#38a169", fontSize: "13px", marginBottom: "12px" }}
              >
                {success}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                backgroundColor: "#7C3AED",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                padding: "14px",
                borderRadius: "999px",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                marginTop: "8px",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#6D28D9")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#7C3AED")}
            >
              {isLoading ? "Updating..." : "Change Password"}
            </motion.button>
          </form>
        </motion.section>
      </main>
    </>
  );
}
