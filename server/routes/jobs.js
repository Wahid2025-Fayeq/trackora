const express = require("express");
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobsController");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

router.get("/", getJobs);
router.post("/", createJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
