const express = require("express")
const router = express.Router();
const VazhipadBookingsController = require("../Controllers/vazhipadBookingController")
const authenticateToken = require("../Middleware/authenticateToken")


router.post('/vazhipad-bookings',VazhipadBookingsController. createVazhipadBooking);
router.get('/vazhipad-bookings/:templeId', authenticateToken, VazhipadBookingsController.getVazhipadBookings);
router.patch("/update-status/:bookingId", authenticateToken,VazhipadBookingsController. updateBookingStatus)

module.exports = router