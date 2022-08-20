const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 1024,
  },
  password: {
    type: String,
    required: true,
    minilength: 6,
    maxlength: 1024,
  },
  bizz: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);
module.exports = { User };
