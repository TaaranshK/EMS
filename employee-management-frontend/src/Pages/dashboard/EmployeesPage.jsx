import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlass, Funnel, PencilSimple,
  Trash, X, Check
} from "@phosphor-icons/react";
import {
  getEmployees, deleteEmployee,
  updateEmployee
} from "../../services/Dashboard";
import InviteModal from "../../Components/dashboard/InviteModal";
import PageSeo from "../../Components/seo/PageSeo";

export default function EmployeesPage() {
  const [employees,   setEmployees]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [department,  setDepartment]  = useState("");
  const [sortBy,      setSortBy]      = useState("createdAt");
  const [sortOrder,   setSortOrder]   = useState("desc");
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalRecords,setTotalRecords]= useState(0);
  const [editingId,   setEditingId]   = useState(null);
  const [editForm,    setEditForm]    = useState({});
  const [showInvite,  setShowInvite]  = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const pageSize = 10;

  const departments = [
    "All", "Engineering", "Human Resources", "Design",
    "Sales", "Marketing", "Finance", "IT"
  ];

  async function loadEmployees() {
    setLoading(true);
    try {
      const params = {
        page, pageSize, sortBy, sortOrder,
        ...(search     && { search }),
        ...(department && department !== "All" && { department })
      };
      const data = await getEmployees(params);
      setEmployees(data.data        || []);
      setTotalPages(data.totalPages  || 1);
      setTotalRecords(data.totalRecords || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadVisibleEmployees = async () => {
      setLoading(true);
      try {
        const params = {
          page, pageSize, sortBy, sortOrder,
          ...(search && { search }),
          ...(department && department !== "All" && { department })
        };
        const data = await getEmployees(params);
        setEmployees(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalRecords(data.totalRecords || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void loadVisibleEmployees();
  }, [department, page, pageSize, search, sortBy, sortOrder]);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setDeleteConfirm(null);
      loadEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditStart = (emp) => {
    setEditingId(emp.id);
    setEditForm({
      firstName:   emp.firstName,
      lastName:    emp.lastName,
      email:       emp.email,
      department:  emp.department  || "",
      jobTitle:    emp.jobTitle    || "",
      phoneNumber: emp.phoneNumber || "",
    });
  };

  const handleEditSave = async (id) => {
    try {
      await updateEmployee(id, editForm);
      setEditingId(null);
      loadEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // Debounce search
  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const inputStyle = {
    padding: "8px 14px", borderRadius: "10px",
    border: "1px solid #e8e5ee", fontSize: "13px",
    outline: "none", background: "#f9f8fc",
    color: "#1a1a2e", fontFamily: "inherit", width: "100%"
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <PageSeo
        title="Employees"
        description="Manage employee records, search staff members, update details, and send invites from the employees dashboard."
      />

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>
            Employees
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#aaa" }}>
            {totalRecords} total employees
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          style={{
            padding: "10px 22px", borderRadius: "999px",
            background: "#2d2d3a", color: "#fff",
            border: "none", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}
        >
          + Invite Employee
        </button>
      </div>

      {/* Filters Row */}
      <div style={{
        display: "flex", gap: "10px",
        marginBottom: "20px", flexWrap: "wrap"
      }}>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <MagnifyingGlass
            size={15} color="#aaa"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: "34px" }}
          />
        </div>

        {/* Department Filter */}
        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          style={{ ...inputStyle, width: "160px", cursor: "pointer" }}
        >
          {departments.map((d) => (
            <option key={d} value={d === "All" ? "" : d}>{d}</option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          style={{ ...inputStyle, width: "150px", cursor: "pointer" }}
        >
          <option value="createdAt">Sort: Date</option>
          <option value="firstName">Sort: First Name</option>
          <option value="lastName">Sort: Last Name</option>
        </select>

        {/* Sort Order */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          style={{
            padding: "8px 16px", borderRadius: "10px",
            border: "1px solid #e8e5ee", background: "#f9f8fc",
            cursor: "pointer", fontSize: "13px", color: "#555",
            display: "flex", alignItems: "center", gap: "6px"
          }}
        >
          <Funnel size={14} />
          {sortOrder === "asc" ? "A → Z" : "Z → A"}
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: "#fff", borderRadius: "20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9f8fc" }}>
              {["Name", "Email", "Department", "Job Title", "Phone", "Status", "Actions"].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "14px 16px",
                  fontSize: "11px", color: "#aaa",
                  fontWeight: "600", letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #f0eef5"
                }}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{
                  textAlign: "center", padding: "40px",
                  fontSize: "13px", color: "#bbb"
                }}>
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={7} style={{
                  textAlign: "center", padding: "40px",
                  fontSize: "13px", color: "#bbb"
                }}>
                  No employees found
                </td>
              </tr>
            ) : employees.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{ borderBottom: "1px solid #f9f8fc" }}
              >
                {editingId === emp.id ? (
                  // ── Edit Row ──
                  <>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          style={{ ...inputStyle, width: "90px", padding: "6px 10px" }}
                          placeholder="First"
                        />
                        <input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          style={{ ...inputStyle, width: "90px", padding: "6px 10px" }}
                          placeholder="Last"
                        />
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        style={{ ...inputStyle, padding: "6px 10px" }}
                        placeholder="Email"
                      />
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        style={{ ...inputStyle, padding: "6px 10px" }}
                        placeholder="Department"
                      />
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        value={editForm.jobTitle}
                        onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                        style={{ ...inputStyle, padding: "6px 10px" }}
                        placeholder="Job Title"
                      />
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        style={{ ...inputStyle, padding: "6px 10px" }}
                        placeholder="Phone"
                      />
                    </td>
                    <td />
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEditSave(emp.id)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            background: "#f0fdf4", border: "none",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center"
                          }}
                        >
                          <Check size={14} color="#15803d" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            background: "#fef2f2", border: "none",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center"
                          }}
                        >
                          <X size={14} color="#b91c1c" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // ── Normal Row ──
                  <>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* Avatar */}
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #7C3AED, #4a4a5a)",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", color: "#fff",
                          fontSize: "12px", fontWeight: "700", flexShrink: 0
                        }}>
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a1a2e" }}>
                          {emp.firstName} {emp.lastName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                      {emp.email}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                      {emp.department || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                      {emp.jobTitle || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                      {emp.phoneNumber || "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "999px", fontSize: "11px",
                        fontWeight: "500",
                        background: emp.isPasswordChanged ? "#f0fdf4" : "#fff7ed",
                        color: emp.isPasswordChanged ? "#15803d" : "#c2410c"
                      }}>
                        {emp.isPasswordChanged ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {/* Edit */}
                        <button
                          onClick={() => handleEditStart(emp)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            background: "#f9f8fc", border: "1px solid #eee",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center"
                          }}
                        >
                          <PencilSimple size={13} color="#666" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteConfirm(emp.id)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            background: "#fef2f2", border: "1px solid #fecaca",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center"
                          }}
                        >
                          <Trash size={13} color="#b91c1c" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: "8px", padding: "16px"
          }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                padding: "6px 16px", borderRadius: "999px",
                border: "1px solid #eee", background: page === 1 ? "#f9f8fc" : "#fff",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontSize: "12px", color: "#555"
              }}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  border: "none", cursor: "pointer", fontSize: "12px",
                  background: p === page ? "#2d2d3a" : "transparent",
                  color: p === page ? "#fff" : "#555",
                  fontWeight: p === page ? "600" : "400"
                }}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              style={{
                padding: "6px 16px", borderRadius: "999px",
                border: "1px solid #eee",
                background: page === totalPages ? "#f9f8fc" : "#fff",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                fontSize: "12px", color: "#555"
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "#fff", borderRadius: "20px",
              padding: "28px", width: "360px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
            }}
          >
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: "#fef2f2", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Trash size={22} color="#b91c1c" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>
              Delete Employee?
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#888" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "12px",
                  border: "1px solid #eee", background: "#f9f8fc",
                  cursor: "pointer", fontSize: "13px", color: "#555"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "12px",
                  border: "none", background: "#b91c1c",
                  cursor: "pointer", fontSize: "13px",
                  color: "#fff", fontWeight: "600"
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSuccess={loadEmployees}
        />
      )}
    </div>
  );
}
