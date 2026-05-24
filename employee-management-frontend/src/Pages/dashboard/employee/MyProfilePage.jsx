import { useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import { getStoredToken } from "../../../utils/authStorage";
import Card from "../../../Components/dashboard/Card";
import EmployeeCard from "../../../Components/dashboard/EmployeeCard";

export default function MyProfilePage() {
  const { employee, setEmployee } = useOutletContext();
  const [formData, setFormData] = useState(() => buildProfileFormData(employee));

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getStoredToken();
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          linkedInUrl: formData.linkedInUrl,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Failed to update profile. Please try again.");
        return;
      }

      setEmployee({ ...employee, ...formData });
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 style={{ fontSize: "38px", fontWeight: "700", color: "#1a1a2e", marginBottom: "0.25rem" }}>My Profile</h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "2rem" }}>Keep your personal details polished and current.</p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem" }}>
        <div>
          <EmployeeCard employee={employee} />

          {[
            { label: "Email", value: employee?.email || "--" },
            { label: "Salary", value: employee?.salary ? `Rs ${Number(employee.salary).toLocaleString()}/yr` : "--" },
            { label: "Department", value: employee?.department || "--" },
          ].map((item) => (
            <Card key={item.label} style={{ padding: "14px 16px", marginTop: "12px" }}>
              <p style={{ fontSize: "11px", color: "#888", margin: "0 0 4px" }}>{item.label}</p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e", margin: 0 }}>{item.value}</p>
            </Card>
          ))}
        </div>

        <Card style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <ProfileField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} disabled />
              <ProfileField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} disabled />
            </div>

            <ProfileField label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
            <ProfileField label="Address" name="address" value={formData.address} onChange={handleChange} />
            <ProfileField label="LinkedIn URL" name="linkedInUrl" type="url" value={formData.linkedInUrl} onChange={handleChange} />
            <ProfileField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
            <ProfileField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other", "Prefer not to say"]}
            />

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}>
                {error}
              </motion.p>
            )}

            {success && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#15803d", fontSize: "13px", marginBottom: "12px" }}>
                {success}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: "#7C3AED",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                padding: "12px 32px",
                borderRadius: "999px",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                transition: "background 0.3s",
              }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </motion.button>
          </form>
        </Card>
      </div>
    </motion.div>
  );
}

function buildProfileFormData(employee) {
  return {
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    phoneNumber: employee?.phoneNumber || "",
    address: employee?.address || "",
    linkedInUrl: employee?.linkedInUrl || "",
    gender: employee?.gender || "",
    dateOfBirth: employee?.dateOfBirth?.split("T")?.[0] || "",
  };
}

function ProfileField({ label, name, value, onChange, type = "text", options, disabled = false }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <label style={{ display: "block", fontSize: "13px", color: "#888", marginBottom: "6px" }}>{label}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange} style={inputStyle} disabled={disabled}>
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} disabled={disabled} />
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  backgroundColor: "#f9f8fc",
  border: "1.5px solid #e8e5ee",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#333",
  outline: "none",
  boxSizing: "border-box",
};
