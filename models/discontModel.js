const mongoose = require("mongoose");

const discontSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
});

const Discont = mongoose.model("Disconts", discontSchema);

module.exports = Discont;
