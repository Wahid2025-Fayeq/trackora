import { useEffect, useState } from "react";
import JobForm from "../JobForm/JobForm";
import "./EditJobModal.css";

function EditJobModal({ isOpen, onClose, job, onUpdateJob }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData) => {
    setIsSubmitting(true);

    onUpdateJob({
      ...job,
      ...formData,
    })
      .then(() => {
        onClose();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, isSubmitting]);

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
    <div
      className="edit-job-modal"
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div
        className="edit-job-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="edit-job-modal__close"
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2 className="edit-job-modal__title">Edit Job</h2>

        <JobForm
          initialValues={job}
          onSubmit={handleSubmit}
          submitButtonText="Save Changes"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default EditJobModal;
