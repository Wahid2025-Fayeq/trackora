import { Bell, CalendarDays, Eye } from "lucide-react";

import Button from "../../ui/Button/Button";
import formatDate from "../../../utils/formatDate";

import "./FollowUpReminders.css";

function ReminderGroup({ title, jobs, className, onView, onComplete }) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <section className="follow-up-reminders__group">
      <h3 className={`follow-up-reminders__heading ${className}`}>
        {title} ({jobs.length})
      </h3>

      <div className="follow-up-reminders__list">
        {jobs.map((job) => (
          <article key={job._id} className="follow-up-reminders__card">
            <div className="follow-up-reminders__info">
              <h4>{job.company}</h4>

              <p>{job.title}</p>

              <div className="follow-up-reminders__date">
                <CalendarDays size={15} />

                <span>{formatDate(job.followUp.date)}</span>
              </div>
            </div>

            <div className="follow-up-reminders__actions">
              <Button
                size="small"
                variant="secondary"
                onClick={() => onView(job)}
              >
                <Eye size={16} />
                View
              </Button>

              <Button size="small" onClick={() => onComplete(job)}>
                ✓ Complete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FollowUpReminders({
  overdue,
  dueToday,
  upcoming,
  onView,
  onComplete,
}) {
  const hasReminders = overdue.length || dueToday.length || upcoming.length;

  if (!hasReminders) {
    return null;
  }

  return (
    <section className="follow-up-reminders">
      <div className="follow-up-reminders__header">
        <Bell size={22} />

        <div>
          <h2>Follow-up Reminders</h2>

          <p>Stay on top of your applications and recruiter follow-ups.</p>
        </div>
      </div>

      <ReminderGroup
        title="🔴 Overdue"
        jobs={overdue}
        className="follow-up-reminders__heading_overdue"
        onView={onView}
        onComplete={onComplete}
      />

      <ReminderGroup
        title="🟡 Due Today"
        jobs={dueToday}
        className="follow-up-reminders__heading_today"
        onView={onView}
        onComplete={onComplete}
      />

      <ReminderGroup
        title="🔵 Upcoming"
        jobs={upcoming}
        className="follow-up-reminders__heading_upcoming"
        onView={onView}
        onComplete={onComplete}
      />
    </section>
  );
}

export default FollowUpReminders;
