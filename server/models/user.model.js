const mongoose = require("mongoose");

const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // username, email, password
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

}, {timestamp: true})


// signup logic  encapsulated within the data model
userSchema.statics.signup = async function(username, email, password){
  if (!username || !email || !password ) {
    throw new Error('All fields are required!');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Email is not valid');
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw new Error('Email already exists');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
      username,
      email,
      password: hash,
    });

    return user;
  } catch (error) {
    throw new Error('Error during password hashing: ' + error.message);
  }

}


// Login 
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error('All fields are required!');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('User not found. Please register first.');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Incorrect email or password');
  }

  return user;
};


module.exports = mongoose.model('User', userSchema);
