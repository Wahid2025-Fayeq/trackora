const express = require("express");
const auth = require("../middleware/auth");
const {
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);

module.exports = router;
