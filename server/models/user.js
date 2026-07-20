const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },

    avatar: {
      type: String,
      default: "",
    },

    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },

      defaultStatus: {
        type: String,
        enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"],
        default: "Applied",
      },

      defaultSort: {
        type: String,
        enum: ["newest", "oldest", "company", "title"],
        default: "newest",
      },

      dateFormat: {
        type: String,
        enum: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
        default: "MM/DD/YYYY",
      },

      notifications: {
        interviewReminders: {
          type: Boolean,
          default: true,
        },

        followUpReminders: {
          type: Boolean,
          default: true,
        },

        applicationUpdates: {
          type: Boolean,
          default: true,
        },

        emailNotifications: {
          type: Boolean,
          default: false,
        },
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator(value) {
          return (
            /[a-z]/.test(value) &&
            /[A-Z]/.test(value) &&
            /\d/.test(value) &&
            /[^A-Za-z0-9]/.test(value)
          );
        },
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
      },
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
