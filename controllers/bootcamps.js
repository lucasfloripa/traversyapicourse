const Bootcamp = require("../models/Bootcamp"),
  asyncHandler = require("../middleware/async"),
  ErrorResponse = require("../utils/errorResponse"),
  path = require("path");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Check for published bootcamps
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID${req.user.id} already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params,
    { body } = req;

  const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
    // new: return the new version
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  await bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.updateBootcampPhoto = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const file = req.files.file;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  // Check if theres a file been uploading
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }

  // Check image size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Check if is a image file
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a photo file`, 400));
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });

  await Bootcamp.findByIdAndUpdate(id, { photo: file.name });

  res.status(200).json({ success: true, data: file.name });
});
