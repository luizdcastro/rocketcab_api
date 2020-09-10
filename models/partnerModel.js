const User = require('./userModel');
const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    payment_methods: {
      type: Array,
    },
    website: {
      type: String,
    },
    open_at: {
      type: String,
    },
    close_at: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
partnerSchema.virtual('discont', {
  ref: 'Disconts',
  foreignField: 'partner',
  localField: '_id',
});

const Partner = mongoose.model('Partners', partnerSchema);

module.exports = Partner;
