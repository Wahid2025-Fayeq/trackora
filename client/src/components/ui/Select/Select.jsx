import ReactSelect from "react-select";

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
  const placeholderOption = options.find((option) => option.value === "");

  const selectableOptions = options.filter((option) => option.value !== "");

  const selectedOption =
    value === ""
      ? null
      : selectableOptions.find((option) => option.value === value) || null;

  const handleChange = (selectedOptionValue) => {
    onChange({
      target: {
        name,
        value: selectedOptionValue?.value || "",
      },
    });
  };

  return (
    <div className="select">
      {label && (
        <label className="select__label" htmlFor={name}>
          {label}
        </label>
      )}

      <ReactSelect
        inputId={name}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={selectableOptions}
        placeholder={placeholderOption?.label || "Select an option"}
        isDisabled={disabled}
        isSearchable={false}
        isClearable={false}
        className="select__component"
        classNamePrefix="trackora-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        maxMenuHeight={220}
        aria-required={required}
        styles={{
          menuPortal: (baseStyles) => ({
            ...baseStyles,
            zIndex: 9999,
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "var(--color-surface)",
            zIndex: 9999,
          }),
          menuList: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "var(--color-surface)",
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "var(--color-surface)",
          }),
        }}
      />
    </div>
  );
}

export default Select;
