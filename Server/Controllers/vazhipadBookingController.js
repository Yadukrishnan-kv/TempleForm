const VazhipadBooking = require("../Models/VazhipadBookingModel");


 const createVazhipadBooking = async (req, res) => {
    try {
      const { templeId, vazhipads, totalAmount } = req.body
  
      const newBooking = new VazhipadBooking({
        temple: templeId,
        vazhipads: vazhipads.map((v) => ({
          vazhipad: v.vazhipadId,
          vazhipadName: v.vazhipadName,
          entries: v.entries,
        })),
        totalAmount,
      })
  
      const savedBooking = await newBooking.save()
  
      res.status(201).json(savedBooking)
    } catch (error) {
      console.error("Error creating vazhipad booking:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

 const getVazhipadBookings = async (req, res) => {
    try {
      const { templeId } = req.params
      const bookings = await VazhipadBooking.find({ temple: templeId }).populate("vazhipad").sort({ createdAt: -1 })
  
      res.status(200).json(bookings)
    } catch (error) {
      console.error("Error fetching vazhipad bookings:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

module.exports = {
    getVazhipadBookings,createVazhipadBooking
    
  };