const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: ["Resume", "Cover Letter", "Job Description", "Other"],
      required: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      default: "raw",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Saved", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    interview: {
      date: {
        type: Date,
        default: null,
      },
      type: {
        type: String,
        enum: ["Phone", "Video", "On-site", ""],
        default: "",
      },
      location: {
        type: String,
        trim: true,
        default: "",
      },
      meetingLink: {
        type: String,
        trim: true,
        default: "",
      },
      notes: {
        type: String,
        trim: true,
        default: "",
      },
    },

    followUp: {
      date: {
        type: Date,
        default: null,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      notes: {
        type: String,
        trim: true,
        default: "",
      },
    },

    documents: {
      type: [documentSchema],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
