const express = require("express");
const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");
const { getUsers } = require("../controllers/users");

const router = express.Router();

router.route("/").get(advancedResults(User, null), getUsers);

module.exports = router;
