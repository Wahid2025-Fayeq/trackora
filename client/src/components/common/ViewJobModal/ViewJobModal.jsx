import { useEffect } from "react";
import { CalendarDays, MapPin, Video, Link as LinkIcon } from "lucide-react";
import { statusConfig } from "../../../utils/statusConfig";
import formatDate from "../../../utils/formatDate";
import CloseButton from "../../ui/CloseButton/CloseButton";
import DocumentsSection from "../DocumentsSection/DocumentsSection";
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

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
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

  const hasInterviewDetails =
    job.interview?.date ||
    job.interview?.type ||
    job.interview?.location ||
    job.interview?.meetingLink ||
    job.interview?.notes;

  const formattedInterviewDate = (() => {
    if (!job.interview?.date) {
      return "";
    }

    const interviewDate = new Date(job.interview.date);

    if (Number.isNaN(interviewDate.getTime())) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(interviewDate);
  })();

  const meetingLink = job.interview?.meetingLink
    ? /^https?:\/\//i.test(job.interview.meetingLink)
      ? job.interview.meetingLink
      : `https://${job.interview.meetingLink}`
    : "";

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
          <p
            id="view-job-modal-description"
            className="view-job-modal__company"
          >
            {job.company}
          </p>
        </header>

        <div className="view-job-modal__details">
          <div className="view-job-modal__detail">
            <span className="view-job-modal__label">Status</span>

            <span
              className={`view-job-modal__status view-job-modal__status_${currentStatus?.className}`}
            >
              {StatusIcon && <StatusIcon size={14} aria-hidden="true" />}
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

        {hasInterviewDetails && (
          <section className="view-job-modal__interview">
            <h3 className="view-job-modal__section-title">Interview Details</h3>

            <div className="view-job-modal__interview-list">
              {job.interview.date && (
                <div className="view-job-modal__interview-item">
                  <CalendarDays size={18} aria-hidden="true" />

                  <div>
                    <span className="view-job-modal__label">Date and Time</span>
                    <p className="view-job-modal__value">
                      {formattedInterviewDate}
                    </p>
                  </div>
                </div>
              )}

              {job.interview.type && (
                <div className="view-job-modal__interview-item">
                  <Video size={18} aria-hidden="true" />

                  <div>
                    <span className="view-job-modal__label">Type</span>
                    <p className="view-job-modal__value">
                      {job.interview.type}
                    </p>
                  </div>
                </div>
              )}

              {job.interview.location && (
                <div className="view-job-modal__interview-item">
                  <MapPin size={18} aria-hidden="true" />

                  <div>
                    <span className="view-job-modal__label">
                      Interview Location
                    </span>
                    <p className="view-job-modal__value">
                      {job.interview.location}
                    </p>
                  </div>
                </div>
              )}

              {job.interview.meetingLink && (
                <div className="view-job-modal__interview-item">
                  <LinkIcon size={18} aria-hidden="true" />

                  <div className="view-job-modal__interview-content">
                    <span className="view-job-modal__label">Meeting Link</span>

                    <a
                      className="view-job-modal__meeting-link"
                      href={meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join interview
                    </a>
                  </div>
                </div>
              )}
            </div>

            {job.interview.notes && (
              <div className="view-job-modal__interview-notes">
                <span className="view-job-modal__label">Interview Notes</span>

                <p className="view-job-modal__notes-text">
                  {job.interview.notes}
                </p>
              </div>
            )}
          </section>
        )}

        <section className="view-job-modal__notes">
          <h3 className="view-job-modal__section-title">General Notes</h3>

          <p className="view-job-modal__notes-text">
            {job.notes || "No notes added for this job."}
          </p>
        </section>

        <DocumentsSection jobId={job._id} />
      </div>
    </div>
  );
}

export default ViewJobModal;
