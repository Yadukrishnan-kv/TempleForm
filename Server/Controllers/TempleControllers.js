const TempleCollection = require('../Models/Temple');

// Register a new temple
const registerTemple = async (req, res) => {
  try {
    const templeData = req.body;
    const newTemple = new TempleCollection(templeData);
    await newTemple.save();
    res.status(201).send(newTemple);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all temples
const getAllTemples = async (req, res) => {
  try {
    const temples = await TempleCollection.find();
    res.status(200).send(temples);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get temple by ID
const getTempleById = async (req, res) => {
  const { templeId } = req.params;
  try {
    const temple = await TempleCollection.findById(templeId);
    if (!temple) {
      return res.status(404).send({ message: 'Temple not found' });
    }
    res.status(200).send(temple);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update temple details
const updateTemple = async (req, res) => {
  const { templeId } = req.params;
  const updates = req.body;

  try {
    const temple = await TempleCollection.findByIdAndUpdate(templeId, updates, { new: true });
    if (!temple) return res.status(404).send({ message: 'Temple not found' });
    res.status(200).send(temple);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete temple
const deleteTemple = async (req, res) => {
  const { templeId } = req.params;
  try {
    const temple = await TempleCollection.findByIdAndDelete(templeId);
    if (!temple) {
      return res.status(404).send({ message: 'Temple not found' });
    }
    res.status(200).send({ message: 'Temple deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Sort temples
const sortTemples = async (req, res) => {
  try {
    const { state, district, taluk } = req.query;
    let query = {};

    if (state) query.state = state;
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;

    // Find temples matching the query
    const temples = await TempleCollection.find(query);
    res.status(200).send(temples);
  } catch (error) {
    res.status(400).send({ message: 'Error fetching filtered temples', error });
  }
};

const verifyTemple = async (req, res) => {
  const { templeId } = req.params;
  const { isVerified, verifiedBy, enabled, show } = req.body;

  try {
    const temple = await TempleCollection.findByIdAndUpdate(
      templeId,
      {
        isVerified,
        verificationDate: isVerified ? new Date() : null,
        verifiedBy: isVerified ? verifiedBy : null,
        enabled,
        show
      },
      { new: true }
    );

    if (!temple) {
      return res.status(404).send({ message: 'Temple not found' });
    }

    res.status(200).send(temple);
  } catch (error) {
    res.status(400).send(error);
  }
};



module.exports = {
  registerTemple,
  getAllTemples,
  getTempleById,
  updateTemple,
  deleteTemple,
  sortTemples,verifyTemple
};




