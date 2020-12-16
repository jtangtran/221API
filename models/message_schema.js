const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {
    type: String,
      required: true,
      trim: true,
      match: /[A-Za-z]{2,}/,
      minlength: 2,
      maxlength: 30
    },
    msg: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    }
  });

module.exports = mongoose.model('message', messageSchema);

