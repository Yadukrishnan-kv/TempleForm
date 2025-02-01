const express = require("express")
const router = express.Router();
const VazhipadBookingsController = require("../Controllers/vazhipadBookingController")
const authenticateToken = require("../Middleware/authenticateToken")


router.post('/vazhipad-bookings', authenticateToken,VazhipadBookingsController. createVazhipadBooking);
router.get('/vazhipad-bookings/:templeId', authenticateToken, VazhipadBookingsController.getVazhipadBookings);

module.exports = router