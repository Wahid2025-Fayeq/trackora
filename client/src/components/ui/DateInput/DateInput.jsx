import { forwardRef } from "react";
import { Calendar } from "lucide-react";

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
      <span className={value ? "date-input__value" : "date-input__placeholder"}>
        {value || placeholder}
      </span>

      <Calendar
        className="date-input__icon"
        size={16}
        aria-hidden="true"
      />
    </button>
  );
});

export default DateInput;
