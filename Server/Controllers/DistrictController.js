const District = require('../Models/DistrictModel');

// Create a new district
 const createDistrict = async (req, res) => {
  try {
    const district = new District(req.body);
    await district.save();
    res.status(201).json(district);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all districts
const getAllDistricts = async (req, res) => {
  try {
      const districts = await District.find().populate('state');
      res.status(200).json(districts);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};


// Update a district
const updateDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.status(200).json(district);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a district
const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.status(200).json({ message: 'District deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
    createDistrict,
    getAllDistricts,
    updateDistrict,
    deleteDistrict,
   
  };