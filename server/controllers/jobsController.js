const Job = require("../models/Job");
const { NotFoundError } = require("../utils/errors");

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json(jobs);
  } catch (error) {
    return next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const newJob = await Job.create({
      ...req.body,
      owner: req.user.id,
    });

    return res.status(201).json(newJob);
  } catch (error) {
    return next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedJob) {
      throw new NotFoundError("Job not found");
    }

    return res.json(updatedJob);
  } catch (error) {
    return next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!deletedJob) {
      throw new NotFoundError("Job not found");
    }

    return res.json(deletedJob);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};
