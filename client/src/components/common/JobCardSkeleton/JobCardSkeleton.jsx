import "./JobCardSkeleton.css";

function JobCardSkeleton() {
  return (
    <article className="job-card job-card_skeleton" aria-hidden="true">
      <div className="job-card__content">
        <div className="job-card__skeleton-line job-card__skeleton-line_title" />
        <div className="job-card__skeleton-line job-card__skeleton-line_company" />

        <div className="job-card__meta">
          <div className="job-card__skeleton-pill" />
          <div className="job-card__skeleton-line job-card__skeleton-line_meta" />
        </div>
      </div>

      <div className="job-card__actions">
        <div className="job-card__skeleton-button" />
        <div className="job-card__skeleton-button" />
        <div className="job-card__skeleton-button" />
      </div>

      <div className="job-card__skeleton-follow-up" />
    </article>
  );
}

export default JobCardSkeleton;
