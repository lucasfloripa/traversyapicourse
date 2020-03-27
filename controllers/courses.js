const Course = require("../models/Course"),
  asyncHandler = require("../middleware/async"),
  ErrorResponse = require("../utils/errorResponse");

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    // Populate
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
