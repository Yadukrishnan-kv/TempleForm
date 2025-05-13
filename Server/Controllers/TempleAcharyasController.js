const TempleAcharyasCollection = require('../Models/TempleAcharyasModel');
const TempleAcharyasRole = require('../Models/TempleAcharyasRole');

// Create FormData
const createFormData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { name, address, phone, pincode, role } = req.body;

    const newData = new TempleAcharyasCollection({
      name,
      address,
      phone,
      pincode,
      role,
      image: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: `api/${req.file.path}`
    }
    });

    await newData.save();

    res.status(201).json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


// Get All FormData
const getAllFormData = async (req, res) => {
  try {
    const allData = await TempleAcharyasCollection.find();
    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Update FormData
const updateFormData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, pincode, role } = req.body;

    const updatePayload = {
      name,
      address,
      phone,
      pincode,
      role
    };

    // Check if a new image file is provided
    if (req.file) {
      updatePayload.image = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: `api/${req.file.path}`
      };
    }

    const updatedData = await TempleAcharyasCollection.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updatedData) {
      return res.status(404).json({ error: 'Form data not found' });
    }

    res.status(200).json({ message: 'Form data updated successfully', data: updatedData });
  }  catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Failed to update form data', details: error.message });
  }
  
};



// Delete FormData
const deleteFormData = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await TempleAcharyasCollection.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ error: 'Form data not found' });
    }
    res.status(200).json({ message: 'Form data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form data' });
  }
};

// Create Role
const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = new TempleAcharyasRole({ name });
    await newRole.save();
    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
};

// Get All Roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await TempleAcharyasRole.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// Update Role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedRole = await TempleAcharyasRole.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// Delete Role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await TempleAcharyasRole.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
};

module.exports = {
  createFormData,
  getAllFormData,
  updateFormData,
  deleteFormData,
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
};
