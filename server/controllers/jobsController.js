const Job = require("../models/job");
const { NotFoundError } = require("../utils/errors");

const createCoverLetterValue = (coverLetter) => {
  const content =
    typeof coverLetter?.content === "string" ? coverLetter.content.trim() : "";

  return {
    content,
    generatedAt: content ? new Date() : null,
  };
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      owner: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.json(jobs);
  } catch (error) {
    return next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      owner: req.user.id,
    };

    if (req.body.coverLetter !== undefined) {
      jobData.coverLetter = createCoverLetterValue(req.body.coverLetter);
    }

    const newJob = await Job.create(jobData);

    return res.status(201).json(newJob);
  } catch (error) {
    return next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const allowedUpdates = [
      "title",
      "company",
      "location",
      "status",
      "appliedDate",
      "notes",
      "jobDescription",
      "interview",
      "followUp",
    ];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.coverLetter !== undefined) {
      updates.coverLetter = createCoverLetterValue(req.body.coverLetter);
    }

    const updatedJob = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      updates,
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
