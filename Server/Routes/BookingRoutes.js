const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/BookingController');

router.post('/Bookingsubmit', bookingController.submitBooking);
router.get('/Bookings', bookingController.getBookings);

module.exports = router;