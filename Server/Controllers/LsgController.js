const Lsg = require('../Models/LsgModel'); // adjust path as needed

// Create a new LSG
const createLsg = async (req, res) => {
  try {
    const lsg = new Lsg(req.body);
    await lsg.save();
    res.status(201).json(lsg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all LSGs
const getAllLsgs =  async (req, res) => {
  try {
    const lsgs = await Lsg.find()
    res.status(200).json(lsgs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching LSGs', error });
  }
}
// Update an LSG
const updateLsg = async (req, res) => {
  try {
    const lsg = await Lsg.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lsg) {
      return res.status(404).json({ message: 'LSG not found' });
    }
    res.status(200).json(lsg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an LSG
const deleteLsg = async (req, res) => {
  try {
    const lsg = await Lsg.findByIdAndDelete(req.params.id);
    if (!lsg) {
      return res.status(404).json({ message: 'LSG not found' });
    }
    res.status(200).json({ message: 'LSG deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createLsg,
  getAllLsgs,
  updateLsg,
  deleteLsg,
};
