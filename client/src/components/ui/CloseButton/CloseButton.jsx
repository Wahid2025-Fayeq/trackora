import { X } from "lucide-react";
import "./CloseButton.css";

function CloseButton({ onClick, disabled = false, className = "" }) {
  return (
    <button
      type="button"
      className={`close-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Close"
    >
      <X size={20} strokeWidth={2.5} />
    </button>
  );
}

export default CloseButton;
