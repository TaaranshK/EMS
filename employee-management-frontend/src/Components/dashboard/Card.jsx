export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

