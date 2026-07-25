const User = require("../models/user");
const { generateCoverLetter } = require("../services/openaiService");

const createCoverLetter = async (req, res, next) => {
  try {
    const { jobTitle, company, jobDescription, experience } = req.body;

    if (!jobTitle || !company || !jobDescription || !experience) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const user = await User.findById(req.user.id).select("name");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const coverLetter = await generateCoverLetter({
      name: user.name,
      jobTitle,
      company,
      jobDescription,
      experience,
    });

    return res.status(200).json({
      coverLetter,
    });
  } catch (error) {
    console.error("AI ERROR:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
    });

    return next(error);
  }
};

module.exports = {
  createCoverLetter,
};
