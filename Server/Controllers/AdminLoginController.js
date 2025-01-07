const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AdminCollection = require("../Models/AdminLoginModel");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await AdminCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await AdminCollection.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin'
    });
    
    if (response?._id) {
      const token = jwt.sign({ id: response._id, role: response.role }, process.env.JWT_KEY, { expiresIn: "7d" });
      return res.status(200).send({ token, user: { id: response._id, name: response.name, email: response.email, role: response.role } });
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
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    
    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
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
    
    res.status(200).send({ message: "Profile updated successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const addSubadmin = async (req, res) => {
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
      role: 'subadmin'
    });
    
    if (response?._id) {
      return res.status(200).send({ message: "Subadmin added successfully", user: { id: response._id, name: response.name, email: response.email, role: response.role } });
    }
  } catch (err) {
    console.log('Add subadmin error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await AdminCollection.find({ role: 'subadmin' }).select('-password');
    res.status(200).send(users);
  } catch (err) {
    console.log('Get users error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const editSubadmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    const subadmin = await AdminCollection.findById(id);
    if (!subadmin) {
      return res.status(404).send({ message: 'Subadmin not found' });
    }
    
    if (name) subadmin.name = name;
    if (email) subadmin.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      subadmin.password = hashedPassword;
    }
    
    await subadmin.save();
    
    res.status(200).send({ message: "Subadmin updated successfully", user: { id: subadmin._id, name: subadmin.name, email: subadmin.email, role: subadmin.role } });
  } catch (err) {
    console.log('Edit subadmin error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const deleteSubadmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subadmin = await AdminCollection.findByIdAndDelete(id);
    if (!subadmin) {
      return res.status(404).send({ message: 'Subadmin not found' });
    }
    
    res.status(200).send({ message: "Subadmin deleted successfully" });
  } catch (err) {
    console.log('Delete subadmin error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

// In your AdminController.js
const updateMenuPermissions = async (req, res) => {
  try {
    const { userId, menuPermissions } = req.body;
    
    // Get the admin user making the request
    const adminUser = await AdminCollection.findById(req.user.id);
    
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).send({ message: 'Unauthorized: Only admin can update permissions' });
    }

    const subadmin = await AdminCollection.findById(userId);
    if (!subadmin) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update the menuPermissions
    subadmin.menuPermissions = {
      ...subadmin.menuPermissions,
      ...menuPermissions
    };

    await subadmin.save();
    
    res.status(200).send({ 
      message: "Menu permissions updated successfully",
      menuPermissions: subadmin.menuPermissions 
    });
  } catch (err) {
    console.log('Update menu permissions error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};



module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  addSubadmin,
  getUsers,
  editSubadmin,
  deleteSubadmin,updateMenuPermissions
};
