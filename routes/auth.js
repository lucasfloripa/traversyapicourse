const express = require("express");
const {
  registerUser,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/updatedetails", protect, updateDetails);
router.get("/updatepassword", protect, updatePassword);
router.get("/me", protect, getMe);

module.exports = router;
