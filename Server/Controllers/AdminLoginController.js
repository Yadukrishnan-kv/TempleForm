const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AdminCollection = require("../Models/AdminLoginModel");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await AdminCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await AdminCollection.create({
      name,
      email,
      password: hashedPassword,
    });
    
    if (response?._id) {
      const token = jwt.sign({ id: response._id }, process.env.JWT_KEY, { expiresIn: "7d" });
      return res.status(200).send({ token, user: response });
    }
  } catch (err) {
    console.log('register error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }
    
    const user = await AdminCollection.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    
    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await AdminCollection.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await AdminCollection.findById(req.user.id);
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    
    await user.save();
    
    res.status(200).send({ message: "Profile updated successfully", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};

