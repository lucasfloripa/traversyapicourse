const User = require("../models/User"),
  asyncHandler = require("../middleware/async"),
  ErrorResponse = require("../utils/errorResponse");

// @desc      Register
// @route     POST /api/v1/auth/register
// @access    Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
