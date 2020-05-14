const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The partner must have a name"],
  },
  category: {
    type: String,
    required: [true, "The partner must have a category"],
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Partner = mongoose.model("Partners", partnerSchema);

module.exports = Partner;
