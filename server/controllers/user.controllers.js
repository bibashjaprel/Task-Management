const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '30d' });
};

// signup to the user 
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    const user = await User.signup(username, email, password);
    const token = createToken(user);

    res.status(200).json({
      email: user.email,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.login(email, password);
    const token = createToken(user);
    res.status(200).json({
      email: user.email,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
