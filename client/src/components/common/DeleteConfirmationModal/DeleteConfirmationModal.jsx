import { useEffect, useState } from "react";
import Button from "../../ui/Button/Button";
import CloseButton from "../../ui/CloseButton/CloseButton";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  title = "Delete job?",
  message,
  confirmText = "Delete",
  loadingText = "Deleting...",
  confirmationText = "",
  isDeleting = false,
}) {
  useBodyScrollLock(isOpen);

  const [confirmation, setConfirmation] = useState("");

  const requiresConfirmation = Boolean(confirmationText);

  const canConfirm =
    !isDeleting && (!requiresConfirmation || confirmation === confirmationText);

  useEffect(() => {
    if (!isOpen) {
      setConfirmation("");
      return;
    }

    const handleEsc = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isDeleting) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!canConfirm) {
      return;
    }

    onConfirm(confirmation);
  };

  const defaultMessage = (
    <>
      Are you sure you want to delete <strong>{jobTitle || "this job"}</strong>?
      This action cannot be undone.
    </>
  );

  return (
    <div
      className="delete-modal"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className="delete-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <CloseButton onClick={onClose} disabled={isDeleting} />

        <h2 id="delete-modal-title" className="delete-modal__title">
          {title}
        </h2>

        <p id="delete-modal-description" className="delete-modal__text">
          {message || defaultMessage}
        </p>

        {requiresConfirmation && (
          <div className="delete-modal__confirmation">
            <label
              className="delete-modal__label"
              htmlFor="delete-confirmation"
            >
              Type <strong>{confirmationText}</strong> to confirm
            </label>

            <input
              id="delete-confirmation"
              className="delete-modal__input"
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={isDeleting}
              autoComplete="off"
              autoFocus
            />
          </div>
        )}

        <div className="delete-modal__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            isLoading={isDeleting}
            loadingText={loadingText}
            disabled={!canConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
