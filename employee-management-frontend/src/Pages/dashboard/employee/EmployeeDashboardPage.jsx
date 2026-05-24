import { useOutletContext } from "react-router-dom";
import {
  EmployeeOverviewGrid,
  EmployeeStatsRibbon,
} from "../../../Components/dashboard/EmployeeDashboardSections";

export default function EmployeeDashboardPage() {
  const { employee, taskSummary, tasks } = useOutletContext();

  const name = employee ? `${employee.firstName} ${employee.lastName}` : "Employee";
  const salary = employee?.salary ? `Rs ${Number(employee.salary).toLocaleString()}/yr` : "--";

  return (
    <div>
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "700",
          color: "#1a1a2e",
          margin: "8px 0 4px",
        }}
      >
        Welcome back, {name}
      </h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "18px" }}>
        Your profile, onboarding rhythm, and workday essentials live here.
      </p>

      <EmployeeStatsRibbon employee={employee} taskSummary={taskSummary} salary={salary} />
      <EmployeeOverviewGrid employee={employee} taskSummary={taskSummary} tasks={tasks} />
    </div>
  );
}
