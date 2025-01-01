const AboutTemple = require('../Models/AboutTemple');

// Add a new description
const addDescription = async (req, res) => {
    try {
        const { description, templeId } = req.body;
        const newDescription = new AboutTemple({ description, templeId });
        await newDescription.save();
        res.status(201).json({ message: 'Description added successfully', data: newDescription });
    } catch (error) {
        res.status(500).json({ message: 'Error adding description', error: error.message });
    }
};

// Get all descriptions for a specific temple
const getDescriptions = async (req, res) => {
    try {
        const { templeId } = req.params;
        const descriptions = await AboutTemple.find({ templeId });
        res.status(200).json(descriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching descriptions', error: error.message });
    }
};

// Update description
const updateDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, templeId } = req.body;
        const updatedDescription = await AboutTemple.findByIdAndUpdate(
            id, 
            { description, templeId },
            { new: true }
        );
        if (!updatedDescription) {
            return res.status(404).json({ message: 'Description not found' });
        }
        res.status(200).json({ message: 'Description updated successfully', data: updatedDescription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating description', error: error.message });
    }
};

// Delete description
const deleteDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDescription = await AboutTemple.findByIdAndDelete(id);
        if (!deletedDescription) {
            return res.status(404).json({ message: 'Description not found' });
        }
        res.status(200).json({ message: 'Description deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting description', error: error.message });
    }
};

module.exports = {
    addDescription,
    getDescriptions,
    updateDescription,
    deleteDescription,
};




