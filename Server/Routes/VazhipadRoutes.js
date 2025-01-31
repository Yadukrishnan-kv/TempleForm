const express = require("express")
const router = express.Router()
const vazhipadController = require("../Controllers/VazhipadController")
const authenticateToken = require("../Middleware/authenticateToken")

router.post("/CreateVazhipad", authenticateToken, vazhipadController.createVazhipad)
router.get("/GetVazhipads", authenticateToken, vazhipadController.getVazhipads)
router.put("/UpdateVazhipad/:id", authenticateToken, vazhipadController.updateVazhipad)
router.delete("/DeleteVazhipad/:id", authenticateToken, vazhipadController.deleteVazhipad)
router.get("/GetVazhipads/:templeId", vazhipadController.getVazhipadsByTempleId)

module.exports = router