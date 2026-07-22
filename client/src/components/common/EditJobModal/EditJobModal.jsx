import { useEffect, useState } from "react";
import JobForm from "../JobForm/JobForm";
import CloseButton from "../../ui/CloseButton/CloseButton";
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

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="edit-job-modal"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="edit-job-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-job-modal-title"
      
      >
        <CloseButton onClick={onClose} disabled={isSubmitting} />

        <h2 className="edit-job-modal__title" id="edit-job-modal-title">
          Edit Job
        </h2>

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
