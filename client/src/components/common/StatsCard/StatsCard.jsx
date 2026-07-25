import "./StatsCard.css";
import { statsConfig } from "../../../utils/statsConfig";

function StatsCard({ title, value }) {
  const Icon = statsConfig[title]?.icon;

  return (
    <div className="stats-card">
      <div className="stats-card__icon">{Icon && <Icon size={22} />}</div>

      <div className="stats-card__content">
        <p className="stats-card__title">{title}</p>
        <h3 className="stats-card__value">{value}</h3>
      </div>
    </div>
  );
}

export default StatsCard;
