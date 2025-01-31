const PoojaCollection = require("../Models/poojaModel");
const UserCollection = require("../Models/UserLogin")
const TempleCollection = require('../Models/Temple');


createPooja = async (req, res) => {
    try {
      const { name, time ,fff} = req.body
      const temple = await TempleCollection.findOne({ email: req.user.email })
      console.log("dd",temple);
      
      if (!temple) {
        return res.status(404).json({ message: "Temple not found" })
      }
  
      const pooja = new PoojaCollection({ name, time, temple: temple._id, })
      await pooja.save()
      res.status(201).json(pooja)
    } catch (error) {
      console.error("Error creating pooja:", error)
      res.status(400).json({ message: error.message })
    }
};



updatePooja =  async (req, res) => {
    try {
      const { name, time, templeId } = req.body
      const temple = await TempleCollection.findById(templeId)
      if (!temple) {
        return res.status(404).json({ message: "Temple not found" })
      }
      const pooja = await PoojaCollection.findByIdAndUpdate(
        req.params.id,
        { name, time, temple: templeId },
        { new: true },
      ).populate("temple", "name")
      if (!pooja) return res.status(404).json({ message: "Pooja not found" })
      res.json({
        _id: pooja._id,
        name: pooja.name,
        time: pooja.time,
        templeName: pooja.temple.name,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
};

deletePooja = async (req, res) => {
    try {
      const pooja = await PoojaCollection.findByIdAndDelete(req.params.id)
      if (!pooja) return res.status(404).json({ message: "Pooja not found" })
      res.json({ message: "Pooja deleted successfully" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
};

module.exports = {
    createPooja,
    updatePooja,
    deletePooja
   
  };