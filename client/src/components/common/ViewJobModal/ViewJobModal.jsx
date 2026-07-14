import { useEffect } from "react";
import { statusConfig } from "../../../utils/statusConfig";
import formatDate from "../../../utils/formatDate";
import CloseButton from "../../ui/CloseButton/CloseButton";
import "./ViewJobModal.css";

function ViewJobModal({ isOpen, onClose, job }) {
  useEffect(() => {
    if (!isOpen) return;

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
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !job) {
    return null;
  }

  const currentStatus = statusConfig[job.status];
  const StatusIcon = currentStatus?.icon;

  return (
    <div
      className="view-job-modal"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="view-job-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-job-modal-title"
      >
        <CloseButton onClick={onClose} />

        <header className="view-job-modal__header">
          <h2 id="view-job-modal-title" className="view-job-modal__title">
            {job.title}
          </h2>
          <p className="view-job-modal__company">{job.company}</p>
        </header>

        <div className="view-job-modal__details">
          <div className="view-job-modal__detail">
            <span className="view-job-modal__label">Status</span>

            <span
              className={`view-job-modal__status view-job-modal__status_${currentStatus?.className}`}
            >
              {StatusIcon && <StatusIcon size={14} />}
              {currentStatus?.label || job.status}
            </span>
          </div>

          <div className="view-job-modal__detail">
            <span className="view-job-modal__label">Application Date</span>
            <span className="view-job-modal__value">
              {formatDate(job.appliedDate)}
            </span>
          </div>

          <div className="view-job-modal__detail">
            <span className="view-job-modal__label">Location</span>
            <span className="view-job-modal__value">{job.location}</span>
          </div>
        </div>

        <section className="view-job-modal__notes">
          <h3 className="view-job-modal__notes-title">Notes</h3>

          <p className="view-job-modal__notes-text">
            {job.notes || "No notes added for this job."}
          </p>
        </section>
      </div>
    </div>
  );
}

export default ViewJobModal;
