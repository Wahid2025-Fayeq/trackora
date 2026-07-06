import "./Input.css";

function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  name,
}) {
  return (
    <div className="input">
      {label && <label className="input__label">{label}</label>}

      <input
        className="input__field"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="input__error">{error}</span>}
    </div>
  );
}

export default Input;
