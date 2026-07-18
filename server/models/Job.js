const mongoose = require("mongoose");

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
