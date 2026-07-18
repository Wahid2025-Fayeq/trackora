import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./MonthlyApplicationsChart.css";

function MonthlyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const applicationCount = payload[0].value;

  return (
    <div className="monthly-chart__tooltip">
      <strong className="monthly-chart__tooltip-label">{label}</strong>

      <span className="monthly-chart__tooltip-value">
        {applicationCount}{" "}
        {applicationCount === 1 ? "application" : "applications"}
      </span>
    </div>
  );
}

function MonthlyApplicationsChart({ data }) {
  return (
    <article className="monthly-chart">
      <div className="monthly-chart__header">
        <h3 className="monthly-chart__title">Monthly Applications</h3>

        <p className="monthly-chart__description">
          Track how many applications you submit each month.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="monthly-chart__empty">
          Add jobs with application dates to view monthly activity.
        </div>
      ) : (
        <div className="monthly-chart__container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <Tooltip
                cursor={{ fill: "rgba(37, 99, 235, 0.06)" }}
                content={<MonthlyTooltip />}
              />

              <Bar
                dataKey="applications"
                fill="#2563eb"
                radius={[10, 10, 0, 0]}
                maxBarSize={42}
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}

export default MonthlyApplicationsChart;
