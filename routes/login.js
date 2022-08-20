const express = require("express");
const bcrypt = require("bcrypt");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { User } = require("../models/Users");
const router = express.Router();

const loginSchema = joi.object({
  email: joi.string().required().min(6).max(1024),
  password: joi.string().required().min(6).max(1024),
});

router.post("/", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("invalid user or password");

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send("invalid user or password");

    const genToken = jwt.sign(
      { _id: user._id, bizz: user.bizz },
      process.env.secretKey
    );

    res.status(200).send({ token: genToken });
  } catch (error) {
    res.status(400).send("error in post user login");
  }
});

module.exports = router;
