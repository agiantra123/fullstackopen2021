const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // for unique field {unique: true}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

schema.plugin(uniqueValidator);
module.exports = mongoose.model('Author', schema);
