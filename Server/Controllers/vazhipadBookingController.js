const VazhipadBooking = require("../Models/VazhipadBookingModel")
const TempleCollection = require("../Models/Temple")

const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const createVazhipadBooking = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY)
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const userId = decoded.id
    const { templeId, vazhipads, totalAmount } = req.body

    const newBooking = new VazhipadBooking({
      user: userId,
      temple: templeId,
      vazhipads: vazhipads.map((v) => ({
        vazhipad: v.vazhipadId,
        vazhipadName: v.vazhipadName,
        entries: v.entries,
      })),
      totalAmount,
      status: "pending", // Default status
    })

    const savedBooking = await newBooking.save()
    const populatedBooking = await VazhipadBooking.findById(savedBooking._id)
      .populate("user", "fullName email")
      .populate("temple", "name")

    res.status(201).json(populatedBooking)
  } catch (error) {
    console.error("Error creating vazhipad booking:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// const getVazhipadBookings = async (req, res) => {
//   try {
//     const { templeId } = req.params
//     console.log("kk",templeId);
    
//     // Validate templeId
//     if (!templeId || !mongoose.Types.ObjectId.isValid(templeId)) {
//       return res.status(400).json({ message: "Invalid temple ID" })
//     }

//     // Find the temple by ID first
//     const temple = await mongoose.model("Temple").findById(templeId)
//     console.log("kk",temple);

//     if (!temple) {
//       console.log("kkkkkk");

//       return res.status(404).json({ message: "Temple not found" })
      
//     }

//     // Find bookings for this temple
//     const bookings = await VazhipadBooking.find({ temple: templeId })
//       .populate("user", "fullName email")
//       .populate("temple", "name location")
//       .sort({ createdAt: -1 })
//       console.log("kkkkkkjjjj",bookings);

//     // If no bookings found, return empty array
//     if (!bookings) {
//       return res.status(200).json([])
//     }

//     res.status(200).json(bookings)
//   } catch (error) {
//     console.error("Error fetching temple bookings:", error)
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

const getVazhipadBookings = async (req, res) => {
  try {
    const temple = await TempleCollection.findOne({ email: req.user.email })
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" })
    }
    const vazhipads = await VazhipadBooking.find({ temple: temple._id })
    .populate("user", "fullName email")
          .populate("temple", "name location")
          .sort({ createdAt: -1 })
          console.log("kkkkkkjjjj",vazhipads);
    
        // If no bookings found, return empty array
        if (!vazhipads) {
          return res.status(200).json([])
        }
    res.json(vazhipads)
  } catch (error) {
    console.error("Error fetching vazhipads:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}


const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body

    // Verify that the status is valid
    const validStatuses = ["pending", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const updatedBooking = await VazhipadBooking.findByIdAndUpdate(bookingId, { status }, { new: true }).populate(
      "user",
      "fullName email",
    )

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.status(200).json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking status:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}


module.exports = {
  getVazhipadBookings,
  createVazhipadBooking,updateBookingStatus
}

