import "./AnalyticsCard.css";

function AnalyticsCard({ title, value, max = 100, suffix = "" }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <article className="analytics-card">
      <div className="analytics-card__header">
        <h3 className="analytics-card__title">{title}</h3>

        <span className="analytics-card__value">
          {value}
          {suffix}
        </span>
      </div>

      <div className="analytics-card__progress">
        <div
          className="analytics-card__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </article>
  );
}

export default AnalyticsCard;
