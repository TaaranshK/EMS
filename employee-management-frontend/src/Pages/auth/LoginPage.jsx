import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import useLoginForm from "../../hooks/useLoginForm";
import InputField from "../../Components/auth/InputField";
import ImagePanel from "../../Components/auth/ImagePanel";
import PageSeo from "../../Components/seo/PageSeo";

export default function LoginPage() {
  const { formData, showPassword, setShowPassword, isLoading, error, role, setRole, handleChange, handleSubmit } = useLoginForm();
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <PageSeo
        title="Login"
        description="Securely sign in to the Employee Management System to access your employee or admin workspace."
      />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, #f5f0ff 0%, #e8daf7 50%, #dcc9f0 100%)",
          padding: isMobile ? "0" : "1.75rem",
        }}
      >
        <div
          style={{
            width: "min(1200px, 100%)",
            minHeight: isMobile ? "100vh" : "calc(100vh - 3.5rem)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            borderRadius: isMobile ? "0" : "36px",
            overflow: "hidden",
            boxShadow: isMobile ? "none" : "0 30px 80px -40px rgba(0,0,0,0.35)",
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(14px)",
            position: "relative",
          }}
        >
          <section
            style={{
              width: isMobile ? "100%" : "45%",
              minHeight: isMobile ? "100vh" : "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: isMobile ? "2rem 1.5rem" : "3rem 3.5rem",
              background: "rgba(255,255,255,0.35)",
            }}
          >
            <header>
              <span
                style={{
                  border: "1.5px solid #ccc",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "Poppins, sans-serif",
                  color: "#444",
                }}
              >
                EMS
              </span>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: isMobile ? "100%" : "420px", width: "100%" }}
            >
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: isMobile ? "2.5rem" : "3.5rem",
                  fontWeight: "700",
                  color: "#2d2d2d",
                  marginBottom: "12px",
                  lineHeight: "1.2",
                }}
              >
                Welcome back
              </h1>
              <p style={{ fontFamily: "Poppins, sans-serif", color: "#777", fontSize: "15px", fontWeight: "400", marginBottom: "2rem" }}>
                Sign in to your account to continue
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "14px" }}>
                  <label
                    htmlFor="role"
                    style={{
                      display: "block",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                      fontSize: "13px",
                      marginBottom: "6px",
                      color: "#2d2d2d",
                    }}
                  >
                    Login as
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      background: "rgba(255,255,255,0.75)",
                      outline: "none",
                    }}
                  >
                    <option value="employee">Employee</option>
                    <option value="superadmin">Admin</option>
                  </select>
                </div>

                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

                <InputField
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  showToggle={true}
                  onToggle={() => setShowPassword(!showPassword)}
                />

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}>
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    backgroundColor: "#7C3AED",
                    color: "#fff",
                    fontWeight: "600",
                    fontFamily: "Poppins, sans-serif",
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
                  {isLoading ? "Signing in..." : "Sign In"}
                </motion.button>
              </form>
            </motion.div>

            <div style={{ height: "1px" }}></div>
          </section>

          {!isMobile && (
            <aside style={{ width: "55%", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: "560px" }}>
                <ImagePanel />
              </div>
            </aside>
          )}

          <footer
            style={{
              position: "absolute",
              bottom: "1.5rem",
              right: "1.5rem",
              display: "flex",
              gap: "2rem",
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
              color: "#aaa",
            }}
          >
            <p style={{ margin: 0 }}>© 2025 Employee Management System</p>
            <a href="#" style={{ color: "#aaa", textDecoration: "none", margin: 0 }}>
              Terms & Conditions
            </a>
          </footer>
        </div>
      </main>
    </>
  );
}
