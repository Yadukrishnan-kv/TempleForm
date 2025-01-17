const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const UserCollection = require("../Models/UserLogin");

const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    const existingUser = await UserCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await UserCollection.create({
      fullName,
      email,
      password: hashedPassword,
      role:  '1'
    });
    
    if (response?._id) {
      const token = jwt.sign({ id: response._id, role: response.role }, process.env.JWT_KEY, { expiresIn: "7d" });
      return res.status(200).send({ token, user: { id: response._id, fullName: response.fullName, email: response.email, role: response.role } });
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
    
    const user = await UserCollection.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    
    return res.status(200).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { 
    register,
    login
}