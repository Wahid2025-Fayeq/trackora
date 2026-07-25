const express = require("express");

const auth = require("../middleware/auth");
const { createCoverLetter } = require("../controllers/aiController");

const router = express.Router();

router.post("/cover-letter", auth, createCoverLetter);

module.exports = router;
