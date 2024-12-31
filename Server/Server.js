const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

require("./Config/db");

// Allow requests from all origins
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/ping', (req, res) => {
    res.send('Server is running!');
});

const TempleRoutes = require('./Routes/TempleRoutes');
app.use("/api/temples", TempleRoutes);
const AdminLoginRoutes = require('./Routes/AdminLoginRoutes');
app.use("/api/adminlogin", AdminLoginRoutes);
const stateRoutes = require('./Routes/StateRoutes');
app.use('/api/states', stateRoutes);
const districtRoutes = require('./Routes/districtRoutes');
app.use('/api/districts', districtRoutes);
const talukRoutes = require('./Routes/TalukRoutes');
app.use('/api/taluks', talukRoutes);
const GalleryRoutes = require('./Routes/GalleryRoutes');
app.use('/api/Gallery', GalleryRoutes);
const aboutTempleRoutes = require('./Routes/AboutTempleRoutes');
app.use('/api/aboutTemple', aboutTempleRoutes);
const port = 4000;
console.log("port:", port);
app.listen(port, (err) => {
    if (err) process.exit(1);
    console.log(`server is running on port ${port}`);
});

