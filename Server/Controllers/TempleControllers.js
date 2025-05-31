const TempleCollection = require('../Models/Temple');
const Gallery = require('../Models/GalleryModel');
const UserCollection = require("../Models/UserLogin");
const bcrypt = require("bcrypt");



// Register a new temple
const registerTemple =  async (req, res) => {
  try {
    const templeData = req.body;
    const existingUser = await UserCollection.findOne({ email: templeData.email });
    if (existingUser) {
      return res.status(400).send({ message: "Email is already registered. Please use a different email." });
}

    // Hash the password
    const hashedPassword = await bcrypt.hash(templeData.password, 10);

    // Create user account
    const userResponse = await UserCollection.create({
      fullName: templeData.name,
      email: templeData.email,
      password: hashedPassword,
      role: "2", // Temple role
    });

    // Create temple record
    const newTemple = new TempleCollection({
      ...templeData,
      userId: userResponse._id,
    });
    await newTemple.save();

    res.status(201).send({ message: "Temple registered successfully", temple: newTemple });
  } catch (error) {
    res.status(400).send({ message: "Error registering temple", error: error.message });
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

const getTempleDetails = async (req, res) => {

  try {
    
 // Use the email from UserLoginModel to find the temple
    const temple = await TempleCollection.findOne({email:req.user.email})
    
    if (!temple) {
      console.log("no Temple");

      return res.status(404).json({ message: "Temple not found" })
    }
    res.status(200).json(temple)
  } catch (error) {
    console.error("Error fetching temple details:", error)
    res.status(500).json({ message: "Error fetching temple details", error: error.message })
  }
}


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
  const { isVerified, verifiedBy,subscriped, enabled, show } = req.body;

  try {
    const temple = await TempleCollection.findByIdAndUpdate(
      templeId,
      {
        isVerified,
        verificationDate: isVerified ? new Date() : null,
        verifiedBy: isVerified ? verifiedBy : null,
        subscriped,
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


const getTemplesByDistrict = async (req, res) => {
  const { district } = req.params;
  try {
    const temples = await TempleCollection.find({ district });
    
    // Fetch the first image for each temple
    const templesWithImages = await Promise.all(temples.map(async (temple) => {
      const images = await Gallery.find({ temple: temple._id }).limit(1);
      return {
        ...temple.toObject(),
        image: images.length > 0 ? images[0].path : null
      };
    }));

    res.status(200).send(templesWithImages);
  } catch (error) {
    res.status(400).send({ message: 'Error fetching temples by district', error });
  }
};


module.exports = {
  registerTemple,
  getAllTemples,
  getTempleById,
  updateTemple,
  deleteTemple,
  sortTemples,verifyTemple,getTemplesByDistrict,getTempleDetails
};




