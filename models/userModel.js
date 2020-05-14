const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  subscription: Boolean,
  image: String,
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
