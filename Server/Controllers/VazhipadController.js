const VazhipadCollection = require("../Models/vazhipadModel")
const TempleCollection = require("../Models/Temple")


const createVazhipad = async (req, res) => {
    try {
      const { name, price } = req.body
      const temple = await TempleCollection.findOne({ email: req.user.email })
  
      if (!temple) {
        return res.status(404).json({ message: "Temple not found" })
      }
  
      const vazhipad = new VazhipadCollection({
        name,
        price,
        temple: temple._id,
        templeName: temple.name,
        templeEmail: temple.email,
      })
      await vazhipad.save()
      res.status(201).json(vazhipad)
    } catch (error) {
      console.error("Error creating vazhipad:", error)
      res.status(400).json({ message: error.message })
    }
  }

  const getVazhipads = async (req, res) => {
    try {
      const temple = await TempleCollection.findOne({ email: req.user.email })
      if (!temple) {
        return res.status(404).json({ message: "Temple not found" })
      }
      const vazhipads = await VazhipadCollection.find({ temple: temple._id })
      res.json(vazhipads)
    } catch (error) {
      console.error("Error fetching vazhipads:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
  
  const updateVazhipad = async (req, res) => {
    try {
      const { id } = req.params
      const { name, price } = req.body
      const updatedVazhipad = await VazhipadCollection.findByIdAndUpdate(id, { name, price }, { new: true })
      if (!updatedVazhipad) {
        return res.status(404).json({ message: "Vazhipad not found" })
      }
      res.json(updatedVazhipad)
    } catch (error) {
      console.error("Error updating vazhipad:", error)
      res.status(400).json({ message: error.message })
    }
  }
  
  const deleteVazhipad = async (req, res) => {
    try {
      const { id } = req.params
      const deletedVazhipad = await VazhipadCollection.findByIdAndDelete(id)
      if (!deletedVazhipad) {
        return res.status(404).json({ message: "Vazhipad not found" })
      }
      res.json({ message: "Vazhipad deleted successfully" })
    } catch (error) {
      console.error("Error deleting vazhipad:", error)
      res.status(400).json({ message: error.message })
    }
  }
  
  const getVazhipadsByTempleId = async (req, res) => {
    try {
      const { templeId } = req.params
      const temple = await TempleCollection.findById(templeId)
  
      if (!temple) {
        return res.status(404).json({ message: "Temple not found" })
      }
  
      const vazhipads = await VazhipadCollection.find({ temple: templeId })
      res.json(vazhipads)
    } catch (error) {
      console.error("Error fetching vazhipads:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
  

  module.exports={
    createVazhipad,getVazhipads,updateVazhipad,deleteVazhipad,getVazhipadsByTempleId
  }