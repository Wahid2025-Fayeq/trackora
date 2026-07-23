const startOfDay = (date) => {
  const normalizedDate = new Date(date);

  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
};

const sortByFollowUpDate = (jobs) =>
  [...jobs].sort(
    (firstJob, secondJob) =>
      new Date(firstJob.followUp.date) - new Date(secondJob.followUp.date),
  );

function getFollowUpReminders(jobs = []) {
  const today = startOfDay(new Date());

  const reminders = jobs.filter((job) => {
    const followUpDate = job.followUp?.date;
    const isCompleted = job.followUp?.completed;

    if (!followUpDate || isCompleted) {
      return false;
    }

    const parsedDate = new Date(followUpDate);

    return !Number.isNaN(parsedDate.getTime());
  });

  const overdue = [];
  const dueToday = [];
  const upcoming = [];

  reminders.forEach((job) => {
    const followUpDate = startOfDay(job.followUp.date);

    if (followUpDate < today) {
      overdue.push(job);
      return;
    }

    if (followUpDate.getTime() === today.getTime()) {
      dueToday.push(job);
      return;
    }

    upcoming.push(job);
  });

  return {
    overdue: sortByFollowUpDate(overdue),
    dueToday: sortByFollowUpDate(dueToday),
    upcoming: sortByFollowUpDate(upcoming),
  };
}

export default getFollowUpReminders;
