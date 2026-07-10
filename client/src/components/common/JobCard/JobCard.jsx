import Button from "../../ui/Button";
import { statusConfig } from "../../../utils/statusConfig";
import "./JobCard.css";

function JobCard({ job, onEdit, onDelete }) {
  const { title, company, status, appliedDate, location } = job;

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus?.icon;

  return (
    <article className="job-card">
      <div className="job-card__content">
        <h3 className="job-card__title">{title}</h3>
        <p className="job-card__company">{company}</p>

        <div className="job-card__meta">
          <span
            className={`job-card__status job-card__status_${currentStatus?.className}`}
          >
            {StatusIcon && <StatusIcon size={14} />}
            {currentStatus?.label}
          </span>
          <span>{appliedDate}</span>
          <span>{location}</span>
        </div>
      </div>

      <div className="job-card__actions">
        <Button size="small" variant="secondary">
          View
        </Button>
        <Button size="small" variant="primary" onClick={() => onEdit(job)}>
          Edit
        </Button>
        <Button size="small" variant="danger" onClick={() => onDelete(job._id)}>
          Delete
        </Button>
      </div>
    </article>
  );
}

export default JobCard;
