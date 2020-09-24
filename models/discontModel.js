const mongoose = require('mongoose');
const Partner = require('./partnerModel');

const discontSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    percentage: {
      type: String,
    },
    partner: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Partners',
        required: [true, 'Review must belong to a user'],
      },
    ],
    time: {
      type: String,
    },
    days: {
      type: Array,
    },
    description: {
      type: String,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

discontSchema.pre('findByIdAndDelete', function (next) {
  var discont = this;
  discont
    .model('Cards')
    .update(
      { discont: { $in: discont.cards } },
      { $pull: { card: card._id } },
      { multi: true },
      next
    );
});

const Discont = mongoose.model('Disconts', discontSchema);

module.exports = Discont;
