const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  getCurrentUser,
  updateCurrentUser,
  uploadAvatar,
  changePassword,
  deleteCurrentUser,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);
router.patch("/me/avatar", auth, upload.single("avatar"), uploadAvatar);
router.patch("/me/password", auth, changePassword);
router.delete("/me", auth, deleteCurrentUser);

module.exports = router;
