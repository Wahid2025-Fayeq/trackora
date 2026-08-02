import { forwardRef } from "react";

import "./DateInput.css";

const DateInput = forwardRef(function DateInput(
  { value, onClick, placeholder, disabled },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className="date-input"
      onClick={onClick}
      disabled={disabled}
    >
      <span className={value ? "" : "date-input__placeholder"}>
        {value || placeholder}
      </span>
    </button>
  );
});

export default DateInput;
