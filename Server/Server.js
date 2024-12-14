const express = require("express")
const app = express()
const cors = require("cors")

require("./config/db")

app.use(cors({
    origin: "http://localhost:3000",
    methods: "*"
}))
app.use(express.json())

const TempleRoutes = require('./Routes/TempleRoutes')
app.use("/api/temples", TempleRoutes)

const AdminLoginRoutes = require('./routes/AdminLoginRoutes')
app.use("/api/adminlogin", AdminLoginRoutes)

app.listen(4000, (err) => {
    if (err) process.exit(1);
    console.log("server is running on port 4000");
})
