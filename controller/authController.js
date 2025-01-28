const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: 'User already exists' });  // Ensure you're returning a meaningful message
    }

    // If no user exists, create the new user
    const user = await User.create({ name, email, password });
    
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Log incoming request body
  console.log("Received login request with email:", email);
  console.log("Request body:", req.body);

  try {
    // Log the process of finding the user
    console.log("Searching for user with email:", email);
    const user = await User.findOne({ email });

    // Log if user is not found
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Log password comparison
    console.log("Comparing passwords...");
    const isPasswordMatch = await user.matchPassword(password);

    if (isPasswordMatch) {
      console.log("Password matched successfully");
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // Log error if any
    console.error("Error during login:", error);
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
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//change password
const changePassword = async (req, res) => {
  const { password, newPassword, usrname } = req.body;
  try {
    console.log(password, newPassword, usrname);

    const user = await User.findOne({ name: usrname });
    console.log(user);

    if (user && (await user.matchPassword(password))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password changed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, changePassword };
