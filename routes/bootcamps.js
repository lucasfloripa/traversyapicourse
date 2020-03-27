const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
const express = require("express");
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
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/:id/photo").put(updateBootcampPhoto);

module.exports = router;
