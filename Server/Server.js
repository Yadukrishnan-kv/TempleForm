const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path");

require("./Config/db");

// Allow requests from all origins
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve uploaded files statically
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/ping', (req, res) => {
    res.send('Server is runnings!');
});

const TempleRoutes = require('./Routes/TempleRoutes');
app.use("/api/temples", TempleRoutes);
const NewFormRoutes = require('./Routes/NewFormRoutes');
app.use("/api/newForm", NewFormRoutes);
const TempleAcharyasRoutes = require('./Routes/TempleAcharyasRoutes');
app.use("/api/TempleAcharyas", TempleAcharyasRoutes);
const AdminLoginRoutes = require('./Routes/AdminLoginRoutes');
app.use("/api/adminlogin", AdminLoginRoutes);
const stateRoutes = require('./Routes/StateRoutes');
app.use('/api/states', stateRoutes);
const districtRoutes = require('./Routes/districtRoutes');
app.use('/api/districts', districtRoutes);
const talukRoutes = require('./Routes/TalukRoutes');
app.use('/api/taluks', talukRoutes);
const lsgRoutes = require('./Routes/LsgRoutes');
app.use('/api/lsg', lsgRoutes);
const SelectedLsgRoutes = require('./Routes/selectedLsgRoutes');
app.use('/api/SelectedLsg', SelectedLsgRoutes);
const GalleryRoutes = require('./Routes/GalleryRoutes');
app.use('/api/Gallery', GalleryRoutes);
const PoojaRoutes = require('./Routes/PoojaRoutes');
app.use('/api/PoojaRoutes', PoojaRoutes);
const vazhipadRoutes = require('./Routes/VazhipadRoutes');
app.use('/api/vazhipadRoutes', vazhipadRoutes);
const VazhipadBookingRoutes = require('./Routes/VazhipadBookingRoutes');
app.use('/api/VazhipadBooking', VazhipadBookingRoutes);
const ContactUsRoutes = require('./Routes/ContactUsRoutes');
app.use('/api/ContactUs', ContactUsRoutes);
const BookingRoutes = require('./Routes/BookingRoutes');
app.use('/api/Bookings', BookingRoutes);
const BlogRoutes = require('./Routes/BlogRoutes');
app.use('/api/Blog', BlogRoutes);
const UserRoutes = require('./Routes/UserLoginRoutes');
app.use('/api/UserRoutes', UserRoutes);

const SubscriptionRoutes = require('./Routes/paymentRoutes');
app.use("/api/payments", SubscriptionRoutes);

const port = 4000;
console.log("port:", port);
app.listen(port, (err) => {
    if (err) process.exit(1);
    console.log(`server is running on port ${port}`);
});

