const Booking = require('../Models/BookingModel');

 const submitBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Booking submitted successfully', booking: newBooking });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting booking', error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching bookings', error: error.message });
  }
};

module.exports={ 
    submitBooking,getBookings

}