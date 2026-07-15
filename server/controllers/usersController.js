const User = require("../models/User");

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
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name },
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

module.exports = {
  getCurrentUser,
  updateCurrentUser,
};
