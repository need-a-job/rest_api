const express = require("express");
const _ = require("lodash");
const { User } = require("../models/Users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    res.status(200).send(_.pick(user, ["_id", "name", "email", "bizz"]));
  } catch (error) {
    res.status(400).send("error in get profile");
  }
});

module.exports = router;
