const asyncHandler = require("../middleware/async");

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Public

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
