import { useEffect, useState } from "react";
import JobForm from "../JobForm/JobForm";
import "./AddJobModal.css";

function AddJobModal({ isOpen, onClose, onAddJob }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData) => {
    setIsSubmitting(true);

    onAddJob({
      ...formData,
      status: "Applied",
      appliedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
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
      >
        <button
          className="add-job-modal__close"
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2 className="add-job-modal__title">Add New Job</h2>

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
