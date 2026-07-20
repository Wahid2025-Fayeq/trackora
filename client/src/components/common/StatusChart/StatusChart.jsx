import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import "./StatusChart.css";

const STATUS_COLORS = {
  Applied: "#2563eb",
  Interview: "#7c3aed",
  Saved: "#d97706",
  Offer: "#16a34a",
  Rejected: "#dc2626",
};

function StatusChart({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const visibleData = data.filter((item) => item.value > 0);

  const totalJobs = visibleData.reduce((total, item) => total + item.value, 0);

  const renderLegend = ({ payload = [] }) => (
    <ul className="status-chart__legend">
      {payload.map((entry) => (
        <li className="status-chart__legend-item" key={entry.payload.name}>
          <span
            className="status-chart__legend-dot"
            style={{ backgroundColor: entry.color }}
          />

          <span>
            {entry.value} ({entry.payload.value})
          </span>
        </li>
      ))}
    </ul>
  );

  const chartCenterY = isMobile ? "39%" : "41%";
  const totalY = isMobile ? "37%" : "39%";
  const labelY = isMobile ? "45%" : "47%";

  return (
    <article className="status-chart">
      <div className="status-chart__header">
        <h3 className="status-chart__title">Applications by Status</h3>

        <p className="status-chart__description">
          See how your job opportunities are distributed.
        </p>
      </div>

      {visibleData.length === 0 ? (
        <div className="status-chart__empty">
          Add jobs to view your application status chart.
        </div>
      ) : (
        <div className="status-chart__container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visibleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy={chartCenterY}
                innerRadius={isMobile ? 48 : 78}
                outerRadius={isMobile ? 72 : 118}
                paddingAngle={3}
                stroke="none"
                animationDuration={900}
              >
                {visibleData.map((item) => (
                  <Cell
                    key={item.name}
                    fill={
                      STATUS_COLORS[item.name] ||
                      "var(--color-text-secondary)"
                    }
                  />
                ))}
              </Pie>

              <text
                x="50%"
                y={totalY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="status-chart__total"
              >
                {totalJobs}
              </text>

              <text
                x="50%"
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="status-chart__total-label"
              >
                Total Jobs
              </text>

              <Tooltip
                formatter={(value, name) => [
                  `${value} ${value === 1 ? "job" : "jobs"}`,
                  name,
                ]}
              />

              <Legend verticalAlign="bottom" content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}

export default StatusChart;
