const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
const express = require("express");
const { protect } = require("../middleware/auth");
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

const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route("/:id/photo").put(protect, updateBootcampPhoto);

module.exports = router;
