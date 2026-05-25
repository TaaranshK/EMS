import PageSeo from "../../Components/seo/PageSeo";

export default function AdminSectionPage({ title }) {
  return (
    <div style={{ padding: "24px 0" }}>
      <PageSeo
        title={title}
        description={`${title} tools for the Employee Management System admin workspace.`}
      />
      <h2 style={{ margin: 0, color: "var(--ink)" }}>{title}</h2>
      <p style={{ marginTop: 8, color: "var(--muted)" }}>This section is not implemented yet.</p>
    </div>
  );
}
