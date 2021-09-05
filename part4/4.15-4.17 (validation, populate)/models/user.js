const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: { type: String, minlength: 3, required: true, unique: true },
  name: { type: String, minlength: 3, required: true },
  passwordHash: String, // do not save passwords to the database as clear text
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // the passwordHash should not be revealed
  },
});

module.exports = mongoose.model('User', userSchema);
