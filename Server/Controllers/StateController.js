const State = require('../Models/StateModel');

// Create a new state
const createState = async (req, res) => {
  try {
    const state = new State(req.body);
    await state.save();
    res.status(201).json(state);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all states
const getAllStates = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
      const states = await State.find().skip(skip).limit(limit);
      const totalStates = await State.countDocuments();
      res.json({ states, totalStates });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching states', error });
  }
};

// Update a state
const updateState = async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.status(200).json(state);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete a state
const deleteState = async (req, res) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.status(200).json({ message: 'State deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
    createState,
    getAllStates,
    updateState,
    deleteState,
   
  };