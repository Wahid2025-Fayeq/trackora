import { useEffect } from "react";
import JobForm from "../JobForm/JobForm";
import "./EditJobModal.css";

function EditJobModal({ isOpen, onClose, job, onUpdateJob }) {
  const handleSubmit = (formData) => {
    onUpdateJob({
      ...job,
      ...formData,
    });

    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !job) {
    return null;
  }

  return (
    <div className="edit-job-modal" onClick={onClose}>
      <div
        className="edit-job-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="edit-job-modal__close"
          type="button"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="edit-job-modal__title">Edit Job</h2>

        <JobForm
          initialValues={job}
          onSubmit={handleSubmit}
          submitButtonText="Save Changes"
        />
      </div>
    </div>
  );
}

export default EditJobModal;
