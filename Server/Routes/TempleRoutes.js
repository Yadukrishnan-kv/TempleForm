const { Router } = require("express");
const TempleRoutes = Router();
const TempleController = require('../Controllers/TempleControllers');

TempleRoutes.post("/register", TempleController.registerTemple);
TempleRoutes.get("/all", TempleController.getAllTemples);
TempleRoutes.get("/sort", TempleController.sortTemples);

TempleRoutes.get("/:templeId", TempleController.getTempleById);
TempleRoutes.put("/update/:templeId", TempleController.updateTemple);
TempleRoutes.delete("/delete/:templeId", TempleController.deleteTemple);

module.exports = TempleRoutes;


