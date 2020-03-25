const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with id of ${id}`));
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(new ErrorResponse(`Bootcamp not found with id of ${id}`));
  }
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    next(error);
  }
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = async (req, res, next) => {
  const { id } = req.params,
    { body } = req;
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    if (!bootcamp) {
      return next(error);
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!bootcamp) {
      return next(error);
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
