import { useEffect, useState } from "react";
import JobForm from "../JobForm/JobForm";
import CloseButton from "../../ui/CloseButton/CloseButton";
import "./AddJobModal.css";

function AddJobModal({ isOpen, onClose, onAddJob }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData) => {
    setIsSubmitting(true);

    onAddJob(formData)
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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="add-job-modal"
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div
        className="add-job-modal__content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-job-modal-title"
      >
        <CloseButton onClick={onClose} disabled={isSubmitting} />

        <h2 id="add-job-modal-title" className="add-job-modal__title">
          Add New Job
        </h2>

        <JobForm
          onSubmit={handleSubmit}
          submitButtonText="Add Job"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default AddJobModal;
