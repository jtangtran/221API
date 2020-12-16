const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    username: {
    type: String,
      required: true,
      trim: true,
      match: /[A-Za-z]{2,}/,
      minlength: 2,
      maxlength: 10
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 64
    },
    email: {
        type: String,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        lowercase: true,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
      }
  });

  //defining mongoose pre-hook for save
  //prehook so call before the save operation
  //req body from userModel.create() is passed here in context of this so we can get 
  //at the plain text password the user entered with this.password
  //second args 
  userSchema.pre('save', async function() {
    // hash and salt password
    try {
      const hash = await argon2.hash(this.password, {
        type: argon2.argon2id
      });
      this.password = hash;
    } catch (err) {
      console.log('Error in hashing password' + err);
    }
  });

  userSchema.methods.verifyPassword =
  async function(plainTextPassword) {
    //this.password refers to the salted and hashed password stored in document
    const dbHashedPassword = this.password;
    try {
      return await argon2.verify(dbHashedPassword,
        plainTextPassword);
    } catch (err) {
      console.log('Error verifying password' + err);
    }
  }

module.exports = mongoose.model('user', userSchema);

