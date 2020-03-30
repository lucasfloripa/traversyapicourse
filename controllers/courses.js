const Course = require("../models/Course"),
  Bootcamp = require("../models/Bootcamp"),
  asyncHandler = require("../middleware/async"),
  ErrorResponse = require("../utils/errorResponse");

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single courses
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(new ErrorResponse(`No curso not found with id of ${id}`, 404));
  }

  res.status(200).json({ success: true, data: course });
});

// @desc      Add courses
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  const { id } = req.user;

  req.body.bootcamp = bootcampId;
  req.body.user = id;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    new ErrorResponse(`No bootcamp with the id of ${bootcampId}`, 400);
  }

  // Make sure user is course owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `user ${id} is not authorized to add a course to bootcamp ${bootcampId}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc      Update courses
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params,
    { body } = req;

  const course = await Course.findById(id);

  if (!course) {
    return new next(ErrorResponse(`Course not found with id of ${id}`, 404));
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`user ${id} is not authorized to update course`, 401)
    );
  }

  const course = await Course.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: course });
});

// @desc      Delete courses
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findBy(id);

  if (!course) {
    return new next(ErrorResponse(`Course not found with id of ${id}`, 404));
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`user ${id} is not authorized to delete this course`, 401)
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});
