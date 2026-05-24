import { motion } from "framer-motion";

export default function EmployeeCard({ employee }) {
  if (!employee) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(160deg, rgba(124,58,237,0.22), rgba(109,40,217,0.60))",
        borderRadius: "20px",
        minHeight: "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.85)",
        fontSize: "14px"
      }}
    >
      No employees yet
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(160deg, rgba(124,58,237,0.24), rgba(109,40,217,0.72))",
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        minHeight: "320px",
        boxShadow: "0 22px 60px -50px rgba(109,40,217,0.70)"
      }}
    >

      {/* Photo or Initials */}
      <div style={{
        width: "100%",
        height: "230px",
        overflow: "hidden",
        background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))"
      }}>
        {employee.profilePhotoUrl ? (
          <img
            src={employee.profilePhotoUrl}
            alt={employee.firstName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "52px",
            fontWeight: "700",
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "2px"
          }}>
            {employee.firstName?.[0]}{employee.lastName?.[0]}
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        background: "linear-gradient(to top, rgba(109,40,217,0.68), rgba(109,40,217,0.0))"
      }}>
        <div>
          <p style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: "700",
            color: "#fff"
          }}>
            {employee.firstName} {employee.lastName}
          </p>
          <p style={{
            margin: "2px 0 0",
            fontSize: "12px",
            color: "rgba(255,255,255,0.55)"
          }}>
            {employee.jobTitle || "—"}
          </p>
        </div>

        {employee.salary && (
          <div style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            padding: "6px 14px",
            borderRadius: "999px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            ${Number(employee.salary).toLocaleString()}
          </div>
        )}
      </div>

    </motion.div>
  );
}
