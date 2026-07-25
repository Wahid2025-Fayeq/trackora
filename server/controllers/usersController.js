const bcrypt = require("bcryptjs");

const User = require("../models/user");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Job = require("../models/job");

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    const passwordIsStrong =
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /\d/.test(newPassword) &&
      /[^A-Za-z0-9]/.test(newPassword);

    if (!passwordIsStrong) {
      return res.status(400).json({
        message:
          "New password must include uppercase, lowercase, a number, and a special character",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  preferences: user.preferences,
});

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(serializeUser(user));
  } catch (error) {
    return next(error);
  }
};

const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, email, preferences } = req.body;

    const normalizedEmail =
      email !== undefined ? email.trim().toLowerCase() : undefined;

    if (normalizedEmail) {
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "An account with this email already exists",
        });
      }
    }

    const updates = {};

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (normalizedEmail !== undefined) {
      updates.email = normalizedEmail;
    }

    if (preferences !== undefined) {
      const { theme, defaultStatus, defaultSort, dateFormat, notifications } =
        preferences;

      if (theme !== undefined) {
        updates["preferences.theme"] = theme;
      }

      if (defaultStatus !== undefined) {
        updates["preferences.defaultStatus"] = defaultStatus;
      }

      if (defaultSort !== undefined) {
        updates["preferences.defaultSort"] = defaultSort;
      }

      if (dateFormat !== undefined) {
        updates["preferences.dateFormat"] = dateFormat;
      }

      if (notifications !== undefined) {
        const {
          interviewReminders,
          followUpReminders,
          applicationUpdates,
          emailNotifications,
        } = notifications;

        if (interviewReminders !== undefined) {
          updates["preferences.notifications.interviewReminders"] =
            interviewReminders;
        }

        if (followUpReminders !== undefined) {
          updates["preferences.notifications.followUpReminders"] =
            followUpReminders;
        }

        if (applicationUpdates !== undefined) {
          updates["preferences.notifications.applicationUpdates"] =
            applicationUpdates;
        }

        if (emailNotifications !== undefined) {
          updates["preferences.notifications.emailNotifications"] =
            emailNotifications;
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(serializeUser(updatedUser));
  } catch (error) {
    return next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload.",
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: uploadResult.secure_url,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(serializeUser(updatedUser));
  } catch (error) {
    return next(error);
  }
};

const deleteCurrentUser = async (req, res, next) => {
  try {
    const { confirmation } = req.body;

    if (confirmation !== "DELETE") {
      return res.status(400).json({
        message: 'Type "DELETE" to confirm account deletion',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Job.deleteMany({
      owner: req.user.id,
    });

    await User.findByIdAndDelete(req.user.id);

    return res.status(200).json({
      message: "Account and job data deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  uploadAvatar,
  changePassword,
  deleteCurrentUser,
};
