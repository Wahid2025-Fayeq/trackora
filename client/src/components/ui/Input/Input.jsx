import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="input">
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
          className="input__field"
          id={name}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        />

        {isPasswordField && (
          <button
            type="button"
            className="input__toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="input__error">{error}</span>}
    </div>
  );
}

export default Input;
