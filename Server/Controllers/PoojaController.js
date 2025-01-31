const PoojaCollection = require("../Models/poojaModel");
const UserCollection = require("../Models/UserLogin")
const TempleCollection = require('../Models/Temple');


createPooja = async (req, res) => {
  try {
    const { name, time, templeName, templeEmail } = req.body
    const temple = await TempleCollection.findOne({ email: req.user.email })

    if (!temple) {
      return res.status(404).json({ message: "Temple not found" })
    }

    const pooja = new PoojaCollection({
      name,
      time,
      temple: temple._id,
      templeName,
      templeEmail,
    })
    await pooja.save()
    res.status(201).json(pooja)
  } catch (error) {
    console.error("Error creating pooja:", error)
    res.status(400).json({ message: error.message })
  }
};
getPoojas = async (req, res) => {
  try {
    const temple = await TempleCollection.findOne({ email: req.user.email })
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" })
    }
    const poojas = await PoojaCollection.find({ temple: temple._id })
    res.json(poojas)
  } catch (error) {
    console.error("Error fetching poojas:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

getTempleInfo = async (req, res) => {
  try {
    const temple = await TempleCollection.findOne({ email: req.user.email });
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" });
    }
    res.json({ name: temple.name, email: temple.email });
  } catch (error) {
    console.error("Error fetching temple info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

updatePooja =  async (req, res) => {
  try {
    const { id } = req.params
    const { name, time } = req.body
    const updatedPooja = await PoojaCollection.findByIdAndUpdate(id, { name, time }, { new: true })
    if (!updatedPooja) {
      return res.status(404).json({ message: "Pooja not found" })
    }
    res.json(updatedPooja)
  } catch (error) {
    console.error("Error updating pooja:", error)
    res.status(400).json({ message: error.message })
  }
};

deletePooja =  async (req, res) => {
  try {
    const { id } = req.params
    const deletedPooja = await PoojaCollection.findByIdAndDelete(id)
    if (!deletedPooja) {
      return res.status(404).json({ message: "Pooja not found" })
    }
    res.json({ message: "Pooja deleted successfully" })
  } catch (error) {
    console.error("Error deleting pooja:", error)
    res.status(400).json({ message: error.message })
  }
};

getPoojasByTempleId = async (req, res) => {
  try {
    const { templeId } = req.params
    const temple = await TempleCollection.findById(templeId)

    if (!temple) {
      return res.status(404).json({ message: "Temple not found" })
    }

    const poojas = await PoojaCollection.find({ temple: templeId })
    res.json(poojas)
  } catch (error) {
    console.error("Error fetching poojas:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
module.exports = {
    createPooja,
    updatePooja,
    deletePooja,getTempleInfo,getPoojas,getPoojasByTempleId
   
  };