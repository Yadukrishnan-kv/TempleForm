const SelectedLsg = require('../Models/SelectedLsg');

// Create a new selected LSG
const createSelectedLsg = async (req, res) => {
  try {
    const selectedLsg = new SelectedLsg(req.body);
    await selectedLsg.save();

    const populatedLsg = await SelectedLsg.findById(selectedLsg._id)
      .populate('lsg')
      .populate('Taluk');

    res.status(201).json(populatedLsg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all selected LSGs
const getAllSelectedLsgs = async (req, res) => {
  try {
    const selectedLsgs = await SelectedLsg.find()
      .populate('lsg')
      .populate('Taluk');

    res.status(200).json(selectedLsgs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a selected LSG
const updateSelectedLsg = async (req, res) => {
  try {
await SelectedLsg.findByIdAndUpdate(req.params.id, req.body);
const updatedLsg = await SelectedLsg.findById(req.params.id).populate('lsg').populate('Taluk');

    if (!updatedLsg) {
      return res.status(404).json({ message: 'Selected LSG not found' });
    }

    const populatedLsg = await SelectedLsg.findById(updatedLsg._id)
      .populate('lsg')
      .populate('Taluk');

    res.status(200).json(populatedLsg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a selected LSG
const deleteSelectedLsg = async (req, res) => {
  try {
    const deletedLsg = await SelectedLsg.findByIdAndDelete(req.params.id);

    if (!deletedLsg) {
      return res.status(404).json({ message: 'Selected LSG not found' });
    }

    res.status(200).json({ message: 'Selected LSG deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createSelectedLsg,
  getAllSelectedLsgs,
  updateSelectedLsg,
  deleteSelectedLsg,
};
