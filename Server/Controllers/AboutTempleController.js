const AboutTemple = require('../Models/AboutTemple');

// Register a new temple
const addDescription = async (req, res) => {
    try {
        const { description } = req.body;
        const newDescription = new AboutTemple({ description });
        await newDescription.save();
        res.status(201).json({ message: 'Description added successfully', data: newDescription });
    } catch (error) {
        res.status(500).json({ message: 'Error adding description', error });
    }
};

// Get all temples
const getDescriptions = async (req, res) => {
    try {
        const descriptions = await AboutTemple.find();
        res.status(200).json(descriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching descriptions', error });
    }
};




// Update temple details
const updateDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updatedDescription = await AboutTemple.findByIdAndUpdate(id, { description }, { new: true });
        res.status(200).json({ message: 'Description updated successfully', data: updatedDescription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating description', error });
    }
};

// Delete temple
const deleteDescription = async (req, res) => {
    try {
        const { id } = req.params;
        await AboutTemple.findByIdAndDelete(id);
        res.status(200).json({ message: 'Description deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting description', error });
    }
};




module.exports = {
    deleteDescription,
    updateDescription,
    getDescriptions,
    addDescription,
  
};




