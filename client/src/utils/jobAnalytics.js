export function getJobAnalytics(jobs) {
  const totalJobs = jobs.length;

  const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
  const interviewJobs = jobs.filter((job) => job.status === "Interview").length;
  const savedJobs = jobs.filter((job) => job.status === "Saved").length;
  const offerJobs = jobs.filter((job) => job.status === "Offer").length;
  const rejectedJobs = jobs.filter((job) => job.status === "Rejected").length;
  const activeJobs = appliedJobs + interviewJobs + savedJobs;

  const interviewRate =
    totalJobs > 0 ? Math.round((interviewJobs / totalJobs) * 100) : 0;

  const offerRate =
    totalJobs > 0 ? Math.round((offerJobs / totalJobs) * 100) : 0;

  const rejectionRate =
    totalJobs > 0 ? Math.round((rejectedJobs / totalJobs) * 100) : 0;

  return {
    totalJobs,
    appliedJobs,
    interviewJobs,
    savedJobs,
    offerJobs,
    rejectedJobs,
    interviewRate,
    offerRate,
    rejectionRate,
    activeJobs,
  };
}

export function getStatusChartData(jobs) {
  const { appliedJobs, interviewJobs, savedJobs, offerJobs, rejectedJobs } =
    getJobAnalytics(jobs);

  return [
    {
      name: "Applied",
      value: appliedJobs,
    },
    {
      name: "Interview",
      value: interviewJobs,
    },
    {
      name: "Saved",
      value: savedJobs,
    },
    {
      name: "Offer",
      value: offerJobs,
    },
    {
      name: "Rejected",
      value: rejectedJobs,
    },
  ];
}

export function getMonthlyApplicationsData(jobs) {
  const monthlyTotals = jobs.reduce((totals, job) => {
    if (!job.appliedDate) {
      return totals;
    }

    const appliedDate = new Date(job.appliedDate);

    if (Number.isNaN(appliedDate.getTime())) {
      return totals;
    }

    const monthKey = `${appliedDate.getFullYear()}-${String(
      appliedDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    totals[monthKey] = (totals[monthKey] || 0) + 1;

    return totals;
  }, {});

  return Object.entries(monthlyTotals)
    .sort(([firstMonth], [secondMonth]) =>
      firstMonth.localeCompare(secondMonth),
    )
    .map(([monthKey, applications]) => {
      const [year, month] = monthKey.split("-");

      const monthLabel = new Date(
        Number(year),
        Number(month) - 1,
      ).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      return {
        month: monthLabel,
        applications,
      };
    });
}
