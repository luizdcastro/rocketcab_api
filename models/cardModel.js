const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: "Partner",
    required: [true, "Card must belong to a partner"],
  },
  discont: {
    type: mongoose.Schema.ObjectId,
    ref: "Discont",
    required: [true, "Card must belong to a discont"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Favorite must belong to a user"],
  },
});

const Card = mongoose.model("Cards", cardSchema);

module.exports = Card;
