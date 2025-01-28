const { Router } = require("express");
const TempleRoutes = Router();
const TempleController = require('../Controllers/TempleControllers');
const authenticateToken = require('../Middleware/authenticateToken');

TempleRoutes.get("/details", authenticateToken, TempleController.getTempleDetails)

TempleRoutes.post("/register", TempleController.registerTemple);
TempleRoutes.get("/all", TempleController.getAllTemples);
TempleRoutes.get("/sort", TempleController.sortTemples);
TempleRoutes.get("/:templeId", TempleController.getTempleById);
TempleRoutes.put("/update/:templeId", TempleController.updateTemple);
TempleRoutes.delete("/delete/:templeId", TempleController.deleteTemple);
TempleRoutes.put('/:templeId/verify',TempleController. verifyTemple);
TempleRoutes.get('/byDistrict/:district', TempleController.getTemplesByDistrict);


module.exports = TempleRoutes;


