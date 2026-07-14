import "./Input.css";

function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  name,
  disabled = false,
  autoComplete = "off",
}) {
  return (
    <div className="input">
      {label && (
        <label className="input__label" htmlFor={name}>
          {label}
        </label>
      )}

      <input
        className="input__field"
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
      />

      {error && <span className="input__error">{error}</span>}
    </div>
  );
}

export default Input;
