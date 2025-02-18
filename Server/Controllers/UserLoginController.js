const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
require('dotenv').config();
const nodemailer = require('nodemailer');

const TempleCollection = require('../Models/Temple');
const UserCollection = require("../Models/UserLogin");

const register = async (req, res) => {
  try {
    const { fullName, email, password, role,confirmPassword } = req.body;
     
      // Check if passwords match
      if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
      }

      // Check if user already exists
      const existingUser = await UserCollection.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }


      // Generate OTP and set expiration
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const Expires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

      const hashedPassword = await bcrypt.hash(password, 10)
      const response = await UserCollection.create({
        fullName,
        email,
        password: hashedPassword,
        role: role || "1", 
        otp,
        Expires
      })
  
      if (response?._id) {
        const token = jwt.sign({ id: response._id, role: response.role }, process.env.JWT_KEY, { expiresIn: "7d" })
        if(email){
          
    
           // Set up Nodemailer transporter
           const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465, 
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            },
          });
          
                // Mail options
                const mailOptions = {
                  from: process.env.EMAIL_USER,   // Use email from .env
              to: email,
              subject: 'Verify Your Account with This OTP Code',
              text: `Dear User,
              Your one-time password (OTP) for accessing your sreeshuddhi account is  ${otp}. This OTP is valid for the next 5 minutes and should not be shared with anyone, including our support team. If you did not request this OTP, please ignore this message.
For your security, never share your OTP with anyone via call, email, or message.`,

            };
                
            transporter.sendMail(mailOptions,  (error, info) => {
                  
              if (error) {
                console.log('SMTP Connection Error:', error);
              } else {
                console.log('SMTP Server is ready to take our messages');
              }
            });
    }
        return res.status(200).send({
          token,
          user: { id: response._id, fullName: response.fullName, email: response.email, role: response.role },
        })

      }
   
      



  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

const verifyemail = async (req, res) => {
  try {
      const { email, otp } = req.body;
      const user = await UserCollection.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify OTP and check if it is expired
      if (user.otp === otp && user.Expires > Date.now()) {
        // OTP is valid, update the user's verified status (if applicable)
        // For example, if you want to mark the user as verified:
        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
      }

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
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
        role: user.role ,
        fullName: user.fullName 
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


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    // Check if the user exists
    const user = await UserCollection.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // If the user is a temple (role 2), delete the associated temple record
    if (user.role === "2") {
      await TempleCollection.findOneAndDelete({ userId: user._id })
    }

    // Delete the user
    await UserCollection.findByIdAndDelete(userId)

    res.status(200).json({ success: true, message: "User and associated data deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and set expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const Expires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    user.otp = otp;
    user.Expires = Expires;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UserCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.Expires < Date.now()) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.Expires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  verifyemail,
  forgotPassword,
  resetPassword,
  deleteUser
};
