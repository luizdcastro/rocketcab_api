const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: "Partner",
    required: [true, "Favorite must belong to a partner"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Favorite must belong to a user"],
  },
});

const Favorite = mongoose.model("Favorites", favoriteSchema);

module.exports = Favorite;
