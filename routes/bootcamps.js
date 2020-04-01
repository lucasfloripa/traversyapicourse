const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcampPhoto
} = require("../controllers/bootcamps");

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), updateBootcampPhoto);

module.exports = router;
