const Taluk = require('../Models/TalukModel');

// Create a new taluk
const createTaluk = async (req, res) => {
  try {
    const taluk = new Taluk(req.body);
    await taluk.save();
    const populatedTaluk = await Taluk.findById(taluk._id)
      .populate('district')
      .populate('state');
    res.status(201).json(populatedTaluk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all taluks
const getAllTaluks = async (req, res) => {
  try {
      const taluks = await Taluk.find()
          .populate('district')
          .populate('state');
      res.status(200).json(taluks);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};


// Update a taluk
const updateTaluk = async (req, res) => {
  try {
    const taluk = await Taluk.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!taluk) {
      return res.status(404).json({ message: 'Taluk not found' });
    }
    res.status(200).json(taluk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a taluk
const deleteTaluk = async (req, res) => {
  try {
    const taluk = await Taluk.findByIdAndDelete(req.params.id);
    if (!taluk) {
      return res.status(404).json({ message: 'Taluk not found' });
    }
    res.status(200).json({ message: 'Taluk deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
    createTaluk,
    getAllTaluks,
    updateTaluk,
    deleteTaluk,
};