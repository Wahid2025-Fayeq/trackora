import "./Select.css";

function Select({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
}) {
  return (
    <div className="select">
      {label && (
        <label className="select__label" htmlFor={name}>
          {label}
        </label>
      )}

      <select
        className="select__field"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.value === ""}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
