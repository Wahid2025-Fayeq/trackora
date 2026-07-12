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
