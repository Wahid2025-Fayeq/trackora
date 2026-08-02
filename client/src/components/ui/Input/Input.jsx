import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import "./Input.css";

const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    onClick,
    error,
    name,
    disabled = false,
    autoComplete = "off",
    className = "",
    readOnly = false,
  },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className={`input ${className}`}>
      {label && (
        <label className="input__label" htmlFor={name}>
          {label}
        </label>
      )}

      <div
        className={`input__wrapper ${
          isPasswordField ? "input__wrapper_password" : ""
        }`}
      >
        <input
          ref={ref}
          className="input__field"
          id={name}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onClick={onClick}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
        />

        {isPasswordField && (
          <button
            type="button"
            className="input__toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="input__error">{error}</span>}
    </div>
  );
});

export default Input;
