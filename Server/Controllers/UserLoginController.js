const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const UserCollection = require("../Models/UserLogin");

const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body

    const existingUser = await UserCollection.findOne({ email })
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await UserCollection.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "1", // Use the provided role or default to '1' for regular users
    })

    if (response?._id) {
      const token = jwt.sign({ id: response._id, role: response.role }, process.env.JWT_KEY, { expiresIn: "7d" })
      return res.status(200).send({
        token,
        user: { id: response._id, fullName: response.fullName, email: response.email, role: response.role },
      })
    }
  } catch (err) {
    console.log("register error:", err.message)
    return res.status(500).send({ message: "Internal server error" })
  }
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide email and password" 
      });
    }

    const user = await UserCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Generate token with both id and role
    const token = jwt.sign(
      { 
        id: user._id,
        email:user.email,
        role: user.role 
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await UserCollection.findById(req.user.id)
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.log("get profile error:", err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await UserCollection.findById(req.user.id);
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const emailExists = await UserCollection.findOne({ email });
      if (emailExists) {
        return res.status(400).send({ message: "Email already in use" });
      }
    }
    
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    
    await user.save();
    
    res.status(200).send({ 
      message: "Profile updated successfully", 
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.log("update profile error:", err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users excluding password field
    const users = await UserCollection.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,getAllUsers
};
