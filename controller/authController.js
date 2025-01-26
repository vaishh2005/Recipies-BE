const jwt = require('jsonwebtoken');
const User = require('../model/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//change password
const changePassword = async (req, res) => {
  const { password, newPassword,usrname } = req.body;
  try{
    console.log(password,newPassword,usrname);
    
      const user = await User.findOne({ name: usrname });
      console.log(user);
      
      if (user && (await user.matchPassword(password))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
      }
      
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
}

module.exports = { registerUser, loginUser, getUserProfile ,changePassword};
