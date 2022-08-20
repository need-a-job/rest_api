const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  adress: {
    type: String,
    required: true,
    minlength: 6,
  },
  description: {
    type: String,
    required: true,
    minilength: 6,
    maxlength: 1024,
  },
  phone: {
    type: String,
    minilength: 9,
    required: true,
    maxlength: 10,
  },
  image: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: Number,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const Card = mongoose.model("cards", cardSchema);
module.exports = { Card };
