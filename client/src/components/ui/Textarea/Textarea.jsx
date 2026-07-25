import "./Textarea.css";

function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  rows = 5,
}) {
  return (
    <div className="textarea">
      {label && (
        <label className="textarea__label" htmlFor={name}>
          {label}
        </label>
      )}

      <textarea
        className="textarea__field"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
      />
    </div>
  );
}

export default Textarea;
