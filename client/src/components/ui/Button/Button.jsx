import "./Button.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  isLoading = false,
  loadingText = "Loading...",
  onClick,
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} button--${size}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}

export default Button;
