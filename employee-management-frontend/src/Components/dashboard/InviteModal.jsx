import { useState } from "react";
import { motion } from "framer-motion";
import { EnvelopeSimple, UploadSimple, X } from "@phosphor-icons/react";
import { inviteBulkEmployees, inviteSingleEmployee } from "../../services/Dashboard";


export default function InviteModal({ onClose, onSuccess }) {
    const [tab , setTab] = useState("single");
    const [loading ,setLoading] = useState(false);
    const [message , setMessage] = useState({text: "" , error: false});
    const [form , setForm] = useState({
    firstName: "", lastName: "", email: "",
    department: "", jobTitle: "", phoneNumber: "", salary: ""
  });
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  //Single Invite Handle
  const handleSingle = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      setMessage({ text: "First name, last name and email are required", error: true });
      return;
    }
    setLoading(true);
    try {
      const res = await inviteSingleEmployee({
        ...form,
        salary: form.salary ? parseFloat(form.salary) : null
      });
      setMessage({ text: res.message || "Invite sent successfully!", error: false });
      onSuccess();
    } catch {
      setMessage({ text: "Something went wrong. Try again.", error: true });
    } finally {
      setLoading(false);
    }
  };


  ///Blulk Invite handle
  const handleBulk = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await inviteBulkEmployees(file);
      setMessage({
        text: `✓ ${res.successCount} invited, ${res.failureCount} skipped`,
        error: false
      });
      onSuccess();
    } catch {
      setMessage({ text: "Upload failed. Check file format.", error: true });
    } finally {
      setLoading(false);
    }
  };
    const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "12px",
    border: "1px solid #eae7f0",
    fontSize: "13px",
    outline: "none",
    background: "#f9f8fc",
    color: "#1a1a2e",
    boxSizing: "border-box",
    fontFamily: "inherit"
  };

  const fields = [
    { key: "firstName",   placeholder: "First Name",   half: true  },
    { key: "lastName",    placeholder: "Last Name",    half: true  },
    { key: "email",       placeholder: "Email Address", half: false },
    { key: "department",  placeholder: "Department",   half: true  },
    { key: "jobTitle",    placeholder: "Job Title",    half: true  },
    { key: "phoneNumber", placeholder: "Phone Number", half: true  },
    { key: "salary",      placeholder: "Salary (optional)", half: true, type: "number" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "28px",
          width: "500px",
          maxWidth: "90vw",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "22px"
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1a1a2e" }}>
              Invite Employee
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#aaa" }}>
              Send an invite via email
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              border: "1px solid #eee", background: "#f9f8fc",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={16} color="#666" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          background: "#f0eef5",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "22px"
        }}>
          {[
            { key: "single", label: "Single Invite", icon: <EnvelopeSimple size={14} /> },
            { key: "bulk",   label: "Bulk Upload",   icon: <UploadSimple size={14} />   }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setMessage({ text: "", error: false }); }}
              style={{
                flex: 1, padding: "9px 16px",
                borderRadius: "10px", border: "none",
                cursor: "pointer", fontSize: "13px", fontWeight: "500",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "6px",
                background: tab === t.key ? "#2d2d3a" : "transparent",
                color: tab === t.key ? "#fff" : "#888",
                transition: "all 0.2s"
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Single Form */}
        {tab === "single" && (
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px"
            }}>
              {fields.map((f) =>
                f.half ? (
                  <input
                    key={f.key}
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={update(f.key)}
                    style={inputStyle}
                  />
                ) : (
                  <input
                    key={f.key}
                    type="email"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={update(f.key)}
                    style={{ ...inputStyle, gridColumn: "span 2" }}
                  />
                )
              )}
            </div>

            <button
              onClick={handleSingle}
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                borderRadius: "12px", border: "none",
                background: loading ? "#aaa" : "#2d2d3a",
                color: "#fff", fontSize: "14px",
                fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                marginTop: "14px", transition: "background 0.2s"
              }}
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        )}

        {/* Bulk Upload */}
        {tab === "bulk" && (
          <div>
            {/* Excel Format Info */}
            <div style={{
              background: "#f9f8fc", borderRadius: "12px",
              padding: "14px", marginBottom: "16px",
              border: "1px solid #eae7f0"
            }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "600", color: "#555" }}>
                Required Excel Columns:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["FirstName", "LastName", "Email", "Department", "JobTitle", "PhoneNumber"].map((col) => (
                  <span key={col} style={{
                    padding: "3px 10px", borderRadius: "999px",
                    background: "#e8e5ee", fontSize: "11px", color: "#555"
                  }}>
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <label style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "10px", padding: "32px",
              border: "2px dashed #e0dcea",
              borderRadius: "16px", cursor: "pointer",
              background: "#faf9fd", transition: "all 0.2s"
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: "#2d2d3a",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <UploadSimple size={22} color="#fff" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>
                  {loading ? "Uploading..." : "Click to upload Excel file"}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#aaa" }}>
                  .xlsx or .xls supported
                </p>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleBulk}
                style={{ display: "none" }}
                disabled={loading}
              />
            </label>
          </div>
        )}

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "14px", padding: "10px 14px",
              borderRadius: "10px", fontSize: "13px",
              background: message.error ? "#fef2f2" : "#f0fdf4",
              color: message.error ? "#b91c1c" : "#15803d",
              border: `1px solid ${message.error ? "#fecaca" : "#bbf7d0"}`
            }}
          >
            {message.text}
          </motion.div>
        )}

      </motion.div>
    </div>
  );


}
