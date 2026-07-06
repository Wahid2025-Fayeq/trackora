import Button from "../../ui/Button";
import "./JobCard.css";

function JobCard({ title, company, status, appliedDate, location }) {
  return (
    <article className="job-card">
      <div className="job-card__content">
        <h3 className="job-card__title">{title}</h3>
        <p className="job-card__company">{company}</p>

        <div className="job-card__meta">
          <span>{status}</span>
          <span>{appliedDate}</span>
          <span>{location}</span>
        </div>
      </div>

      <div className="job-card__actions">
        <Button size="small" variant="secondary">
          View
        </Button>
        <Button size="small">Edit</Button>
        <Button size="small" variant="danger">
          Delete
        </Button>
      </div>
    </article>
  );
}

export default JobCard;
