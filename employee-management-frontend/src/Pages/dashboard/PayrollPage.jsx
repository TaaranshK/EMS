import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getEmployees } from "../../services/Dashboard";
import { Money, TrendUp, Users, CalendarBlank } from "@phosphor-icons/react";
import PageSeo from "../../Components/seo/PageSeo";

export default function PayrollPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees({ page: 1, pageSize: 100 }).then((res) => {
      setEmployees(res.data || []);
    });
  }, []);

  const totalPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const avgSalary =
    employees.length > 0 ? Math.round(totalPayroll / employees.length) : 0;
  const today = new Date();
  const nextPayday = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const daysUntilPay = Math.ceil(
    (nextPayday - today) / (1000 * 60 * 60 * 24),
  );

  const statCards = [
    {
      label: "Total Monthly Payroll",
      value: `$${totalPayroll.toLocaleString()}`,
      sub: "This month",
      icon: <Money size={22} color="#fff" />,
      bg: "#2d2d3a",
    },
    {
      label: "Average Salary",
      value: `$${avgSalary.toLocaleString()}`,
      sub: "Per employee",
      icon: <TrendUp size={22} color="#fff" />,
      bg: "#4a4a5a",
    },
    {
      label: "Total Employees",
      value: employees.length,
      sub: "On payroll",
      icon: <Users size={22} color="#fff" />,
      bg: "#6b5b7e",
    },
    {
      label: "Next Payday",
      value: `${daysUntilPay} days`,
      sub: nextPayday.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
      icon: <CalendarBlank size={22} color="#fff" />,
      bg: "#7C3AED",
    },
  ];

  return (
    <div style={{ padding: "24px 28px" }}>
      <PageSeo
        title="Payroll"
        description="Review payroll totals, salary averages, upcoming pay cycles, and employee compensation details."
      />
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#1a1a2e",
          }}
        >
          Payroll
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#aaa" }}>
          {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              {card.icon}
            </div>
            <p
              style={{
                margin: "0 0 2px",
                fontSize: "24px",
                fontWeight: "700",
                color: "#1a1a2e",
              }}
            >
              {card.value}
            </p>
            <p
              style={{
                margin: "0 0 2px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#555",
              }}
            >
              {card.label}
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
              {card.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Payroll Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0eef5" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: "600",
              color: "#1a1a2e",
            }}
          >
            Employee Salary Breakdown
          </h3>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9f8fc" }}>
              {[
                "Employee",
                "Department",
                "Job Title",
                "Monthly Salary",
                "Annual Salary",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 20px",
                    fontSize: "11px",
                    color: "#aaa",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #f0eef5",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    fontSize: "13px",
                    color: "#bbb",
                  }}
                >
                  No employees on payroll yet
                </td>
              </tr>
            ) : (
              employees.map((emp, i) => {
                const monthly = emp.salary || 0;
                const annual = monthly * 12;

                return (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: "1px solid #f9f8fc" }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #7C3AED, #4a4a5a)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "700",
                            flexShrink: 0,
                          }}
                        >
                          {emp.firstName?.[0]}
                          {emp.lastName?.[0]}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#1a1a2e",
                            }}
                          >
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#888" }}>
                      {emp.department || "—"}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#888" }}>
                      {emp.jobTitle || "—"}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#1a1a2e",
                      }}
                    >
                      {monthly > 0 ? `$${monthly.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#555" }}>
                      {annual > 0 ? `$${annual.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: "500",
                          background: emp.isPasswordChanged ? "#f0fdf4" : "#fff7ed",
                          color: emp.isPasswordChanged ? "#15803d" : "#c2410c",
                        }}
                      >
                        {emp.isPasswordChanged ? "Active" : "Pending"}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer Total */}
        {employees.length > 0 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #f0eef5",
              display: "flex",
              justifyContent: "flex-end",
              gap: "40px",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>Total Monthly</p>
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1a1a2e",
                }}
              >
                ${totalPayroll.toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>Total Annual</p>
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1a1a2e",
                }}
              >
                ${(totalPayroll * 12).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
