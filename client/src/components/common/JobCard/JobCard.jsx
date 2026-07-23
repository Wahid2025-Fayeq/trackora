import { Bell, CheckCircle } from "lucide-react";

import Button from "../../ui/Button";
import { statusConfig } from "../../../utils/statusConfig";
import formatDate from "../../../utils/formatDate";
import "./JobCard.css";

function JobCard({ job, onView, onEdit, onDelete }) {
  const { title, company, status, appliedDate, location, followUp } = job;

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus?.icon;

  const hasFollowUp = Boolean(followUp?.date);
  const isFollowUpCompleted = Boolean(followUp?.completed);

  const isFollowUpOverdue =
    hasFollowUp && !isFollowUpCompleted && new Date(followUp.date) < new Date();

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onView(job);
  };

  return (
    <article className="job-card">
      <div className="job-card__content">
        <h3 className="job-card__title">{title}</h3>
        <p className="job-card__company">{company}</p>

        <div className="job-card__meta">
          <span
            className={`job-card__status job-card__status_${currentStatus?.className}`}
          >
            {StatusIcon && <StatusIcon size={14} aria-hidden="true" />}
            {currentStatus?.label}
          </span>
          <span>{formatDate(appliedDate)}</span>
          <span>{location}</span>
        </div>
      </div>

      {hasFollowUp && (
        <div
          className={`job-card__follow-up ${
            isFollowUpCompleted
              ? "job-card__follow-up_completed"
              : isFollowUpOverdue
                ? "job-card__follow-up_overdue"
                : "job-card__follow-up_upcoming"
          }`}
        >
          <div className="job-card__follow-up-info">
            {isFollowUpCompleted ? (
              <CheckCircle size={16} />
            ) : (
              <Bell size={16} />
            )}

            <span className="job-card__follow-up-label">
              {isFollowUpCompleted
                ? "Follow-up completed"
                : isFollowUpOverdue
                  ? "Follow-up overdue"
                  : "Follow-up"}
            </span>
          </div>

          <span className="job-card__follow-up-date">
            {formatDate(followUp.date)}
          </span>
        </div>
      )}

      <div className="job-card__actions">
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={handleViewClick}
        >
          View
        </Button>
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={() => onEdit(job)}
        >
          Edit
        </Button>
        <Button
          type="button"
          size="small"
          variant="danger"
          onClick={() => onDelete(job._id)}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}

export default JobCard;
