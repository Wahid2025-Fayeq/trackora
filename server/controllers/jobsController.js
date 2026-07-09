const jobs = require("../data/jobs");

const getJobs = (req, res) => {
  res.json(jobs);
};

const createJob = (req, res) => {
  const newJob = {
    id: Date.now(),
    ...req.body,
  };

  jobs.push(newJob);

  res.status(201).json(newJob);
};

const updateJob = (req, res) => {
  const jobId = Number(req.params.id);

  const jobIndex = jobs.findIndex((job) => job.id === jobId);

  if (jobIndex === -1) {
    return res.status(404).json({ message: "Job not found" });
  }

  jobs[jobIndex] = {
    ...jobs[jobIndex],
    ...req.body,
    id: jobId,
  };

  return res.json(jobs[jobIndex]);
};

const deleteJob = (req, res) => {
  const jobId = Number(req.params.id);

  const jobIndex = jobs.findIndex((job) => job.id === jobId);

  if (jobIndex === -1) {
    return res.status(404).json({ message: "Job not found" });
  }

  const deletedJob = jobs.splice(jobIndex, 1);

  return res.json(deletedJob[0]);
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};
