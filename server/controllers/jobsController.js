const Job = require("../models/Job");

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);

    return res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};

const createJob = async (req, res) => {
  try {
    const newJob = await Job.create(req.body);

    return res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);

    return res.status(400).json({
      message: "Failed to create job",
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);

    return res.status(400).json({
      message: "Failed to update job",
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.json(deletedJob);
  } catch (error) {
    console.error("Error deleting job:", error);

    return res.status(400).json({
      message: "Failed to delete job",
    });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};
