const Review = require("../models/Review"),
  Bootcamp = require("../models/Bootcamp"),
  asyncHandler = require("../middleware/async"),
  ErrorResponse = require("../utils/errorResponse");

// @desc      Get all reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const review = await Review.find({ bootcamp: bootcampId });
    return res
      .status(200)
      .json({ success: true, count: review.length, data: review });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single reviews
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!review) {
    return next(new ErrorResponse(`Review with id ${id} not founded`, 400));
  }

  return res.status(200).json({ success: true, data: review });
});

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  req.body.bootcamp = bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp founded with the id of ${bootcampId}`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// @desc      Update review
// @route     Put /api/v1/review/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let review = await Review.findById(id);

  if (!review) {
    return next(
      new ErrorResponse(`No review founded with the id of ${bootcampId}`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: review });
});

// @desc      Delete review
// @route     DELETE /api/v1/review/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    return next(
      new ErrorResponse(`No review founded with the id of ${bootcampId}`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
