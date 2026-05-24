const InputField = ({ label, id, type, name, value, onChange, placeholder, showToggle, onToggle, disabled = false, readOnly = false }) => {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "14px", fontFamily: "Poppins, sans-serif", fontWeight: "500", color: "#666", marginBottom: "6px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id} type={type} name={name} value={value}
          onChange={onChange} placeholder={placeholder} required
          disabled={disabled}
          readOnly={readOnly}
          style={{
            width: "100%", backgroundColor: "#fff",
            border: "1.5px solid #e5e7eb", borderRadius: "999px",
            padding: "12px 20px", fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "#333",
            outline: "none", boxSizing: "border-box",
            paddingRight: showToggle ? "48px" : "20px",
            opacity: disabled ? 0.8 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        {showToggle && (
          <button type="button" onClick={onToggle}
            aria-label="Toggle password visibility"
            style={{
              position: "absolute", right: "16px", top: "50%",
              transform: "translateY(-50%)", background: "none",
              border: "none", cursor: "pointer", color: "#999", fontSize: "18px",
            }}
          >
            {type === "password" ? "👁" : "🙈"}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
