import { useEffect } from "react";
import Button from "../../ui/Button/Button";
import CloseButton from "../../ui/CloseButton/CloseButton";
import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  isDeleting = false,
}) {
  useEffect(() => {
    if (!isOpen) {
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isDeleting) {
      onClose();
    }
  };

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
      >
        <CloseButton onClick={onClose} disabled={isDeleting} />

        <h2 id="delete-modal-title" className="delete-modal__title">
          Delete job?
        </h2>

        <p className="delete-modal__text">
          Are you sure you want to delete{" "}
          <strong>{jobTitle || "this job"}</strong>? This action cannot be
          undone.
        </p>

        <div className="delete-modal__actions">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isDeleting}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
