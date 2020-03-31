const express = require("express");
const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");
const { authorize, protect } = require("../middleware/auth");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(advancedResults(User, null), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(advancedResults(User, null), getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
