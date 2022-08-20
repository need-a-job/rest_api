const express = require("express");
const joi = require("joi");
const _ = require("lodash");
const router = express.Router();
const { Card } = require("../models/Cards");
const auth = require("../middlewares/auth");

const cardsSchema = joi.object({
  name: joi.string().required().min(2),
  adress: joi.string().required().min(6),
  description: joi.string().required().min(6).max(1024),
  phone: joi
    .string()
    .min(9)
    .required()
    .max(10)
    .regex(/^0[2-9]\d{7,8}$/),
  image: joi.string().required(),
});

const genCardNumber = async () => {
  while (true) {
    let randomaNum = _.random(1000, 999999);
    let card = await Card.findOne({ cardNumber: randomaNum });
    if (!card) return randomaNum;
  }
};

router.post("/", auth, async (req, res) => {
  const { error } = cardsSchema.validate(req.body);
  if (error) return res.status(400).send(error.message);

  let card = new Card(req.body);
  card.cardNumber = await genCardNumber();
  card.user_id = req.payload._id;

  await card.save();
  res.status(201).send(card);
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const myCards = await Card.find({ user_id: req.payload._id });
    res.status(200).send(myCards);
  } catch (error) {}
});

router.get("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findOne({
      _id: req.params.id,
      user_id: req.payload._id,
    });
    if (!card) return res.status(400).send("card not found");

    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("Error in get specific card");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = cardsSchema.validate(req.body);
    if (error) return res.status(400).send("error.message");

    let card = await Card.findOneAndUpdate(
      { _id: req.params.id, user_id: req.payload._id },
      req.body,
      { new: true }
    );
    if (!card) return res.status(400).send("Card was not found");

    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("Error in put specific card");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove({
      _id: req.params.id,
      user_id: req.payload._id,
    });
    res.status(200).send("card was deleted");
  } catch (error) {
    res.status(400).send("error in delete specific card");
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    let cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send("problems in get all ");
  }
});

module.exports = router;
