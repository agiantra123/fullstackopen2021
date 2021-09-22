const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // for unique field {unique: true}

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  name: {
    type: String,
    required: true,
    unique: false,
    minlength: 4,
  },
  passwordHash: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  favoriteGenre: {
    type: String,
  },
});

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

schema.plugin(uniqueValidator);
module.exports = mongoose.model('User', schema);
