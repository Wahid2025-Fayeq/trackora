const User = require("../models/user");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
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
    const { name, email } = req.body;

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

    return res.status(200).json(serializeUser(updatedUser));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  uploadAvatar,
};
