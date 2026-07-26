import { useEffect, useState } from "react";

import useBodyScrollLock from "../../../hooks/useBodyScrollLock";
import CloseButton from "../../ui/CloseButton/CloseButton";
import JobForm from "../JobForm/JobForm";

import "./AddJobModal.css";

function AddJobModal({
  isOpen,
  onClose,
  onAddJob,
  defaultStatus = "Applied",
  dateFormat = "MM/DD/YYYY",
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useBodyScrollLock(isOpen);

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

    const handleEsc = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="add-job-modal"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="add-job-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-job-modal-title"
      >
        <CloseButton onClick={onClose} disabled={isSubmitting} />

        <h2 id="add-job-modal-title" className="add-job-modal__title">
          Add New Job
        </h2>

        <JobForm
          defaultStatus={defaultStatus}
          dateFormat={dateFormat}
          onSubmit={handleSubmit}
          submitButtonText="Add Job"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default AddJobModal;
