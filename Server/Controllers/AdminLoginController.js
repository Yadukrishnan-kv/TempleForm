const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const {AdminCollection,AdminLogCollection} = require("../Models/AdminLoginModel");

const register = async (req, res) => {
  try {
    const { name, email, password, role, } = req.body;
    
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
    const { email, phone, password } = req.body;

    // Check if either email or phone is provided, and password is provided
    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: "Please provide email or phone and password" });
    }

    // Find user by email or phone
    const user = await AdminCollection.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean) // Remove nulls
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid email/phone or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await createLogEntry(user._id, 'Failed Login', 'Authentication', 'Login', req);
      return res.status(400).json({ message: "Invalid email/phone or password" });
    }

    await createLogEntry(user._id, 'Login', 'Authentication', 'Login');

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


// Add this new method to handle action logging
const logAction = async (req, res) => {
  try {
    const { action, module, subModule, details } = req.body;
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    await AdminLogCollection.create({
      userId,
      action,
      module,
      subModule,
      details,
      ipAddress
    });

    res.status(200).json({ message: 'Action logged successfully' });
  } catch (error) {
    console.error('Error logging action:', error);
    res.status(500).json({ message: 'Error logging action' });
  }
};

// Update the existing logMenuAction
const logMenuAction = async (req, res) => {
  try {
    const { module, subModule } = req.body;
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    await AdminLogCollection.create({
      userId,
      action: 'Menu Click',
      module,
      subModule,
      details: `Accessed ${subModule} under ${module}`,
      ipAddress // Add this line
    });

    res.status(200).json({ message: 'Menu action logged successfully' });
  } catch (error) {
    console.error('Error logging menu action:', error);
    res.status(500).json({ message: 'Error logging menu action' });
  }
};
const getAllAdminNames = async (req, res) => {
  try {
    const users = await AdminCollection.find({}, { name: 1, role: 1 })
      .sort({ role: 1, name: 1 });
    
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllAdminNames:', error);
    res.status(500).json({ message: 'Error fetching admin names', error: error.message });
  }
};

const getAdminLogs = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    console.log('Query params:', { startDate, endDate, userId }); // Debug log
    
    let matchQuery = {};

    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z') // Include the entire end date
      };
    }

    if (userId && userId !== 'all') {
      try {
        matchQuery.userId = new mongoose.Types.ObjectId(userId);
      } catch (err) {
        console.error('Invalid userId format:', err);
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
    }

    console.log('Match query:', matchQuery); // Debug log

    const logs = await AdminLogCollection.aggregate([
      { 
        $match: matchQuery 
      },
      {
        $lookup: {
          from: 'admins', // Make sure this matches your collection name
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { 
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true // Keep logs even if user is deleted
        }
      },
      {
        $project: {
          _id: 1,
          role: '$user.role',
          name: '$user.name',
          action: 1,
          module: 1,
          subModule: 1,
          createdAt: 1,
          ipAddress: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    console.log(`Found ${logs.length} logs`); // Debug log

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error in getAdminLogs:', error);
    res.status(500).json({ 
      message: 'Error fetching admin logs', 
      error: error.message 
    });
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
    const { name, email, password, role,phone,state,district,taluk} = req.body;
    
    const existingUser = await AdminCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await AdminCollection.create({
      name,
      email,
      phone,
      password: hashedPassword,
      state,
      district,
      taluk,
      role: role || 'subadmin1'
    });
    
    if (response?._id) {
      return res.status(200).send({ message: "Subadmin added successfully", user: { id: response._id, name: response.name, email: response.email, role: response.role,phone: response.phone, state: response.state, district: response.district, taluk: response.taluk } });
    }
  } catch (err) {
    console.log('Add subadmin error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await AdminCollection.find({ role: { $ne: 'admin' } }).select('-password');
    res.status(200).send(users);
  } catch (err) {
    console.log('Get users error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = AdminCollection.schema.path('role').enumValues.filter(role => role !== 'admin');
    res.status(200).send(roles);
  } catch (err) {
    console.log('Get roles error:', err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};


const editSubadmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password,phone,state,district,taluk } = req.body;
    
    const subadmin = await AdminCollection.findById(id);
    if (!subadmin) {
      return res.status(404).send({ message: 'Subadmin not found' });
    }
    
    if (name) subadmin.name = name;
    if (phone) subadmin.phone = phone;
    if (email) subadmin.email = email;
    if (state) subadmin.state = state;
    if (district) subadmin.district = district;
    if (taluk) subadmin.taluk = taluk;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      subadmin.password = hashedPassword;
    }
    
    await subadmin.save();
    
    res.status(200).send({ message: "Subadmin updated successfully", user: { id: subadmin._id, name: subadmin.name, email: subadmin.email, role: subadmin.role, phone: subadmin.phone ,state: subadmin.state, district: subadmin.district, taluk: subadmin.taluk  } });
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
const updateRolePermissions = async (req, res) => {
  try {
    const { role, menuPermissions } = req.body;

    // Update all users with the specified role
    const result = await AdminCollection.updateMany(
      { role: role },
      { $set: { menuPermissions: menuPermissions } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Role permissions updated successfully', menuPermissions });
    } else {
      res.status(404).json({ message: 'No users found with the specified role' });
    }
  } catch (error) {
    console.error('Error updating role permissions:', error);
    res.status(500).json({ message: 'Error updating role permissions' });
  }
};
const getRolesWithPermissions = async (req, res) => {
  try {
    const roles = await AdminCollection.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      {
        $group: {
          _id: '$role',
          menuPermissions: { $first: '$menuPermissions' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles with permissions:', error);
    res.status(500).json({ message: 'Error fetching roles with permissions' });
  }
};


const createLogEntry = async (userId, action, module, subModule, req) => {
  try {
    // Default IP if req is undefined or doesn't have IP information
    const ipAddress = req ? (req.ip || req.connection?.remoteAddress || '0.0.0.0') : '0.0.0.0';
    
    await AdminLogCollection.create({
      userId,
      action: action === 'Login Successful' ? 'Login' : action,
      module,
      subModule,
      ipAddress
    });
  } catch (error) {
    console.error('Error creating log entry:', error);
  }
};
const deleteLogs = async (req, res) => {
  try {
    const { logIds } = req.body;
    await AdminLogCollection.deleteMany({ _id: { $in: logIds } });
    res.status(200).json({ message: 'Logs deleted successfully' });
  } catch (error) {
    console.error('Error deleting logs:', error);
    res.status(500).json({ message: 'Error deleting logs' });
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
  deleteSubadmin,
  updateRolePermissions,
  getRoles,
  getRolesWithPermissions,
  logMenuAction,
  getAdminLogs,
  createLogEntry,logAction,deleteLogs,getAllAdminNames

};
