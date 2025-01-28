const { Router } = require("express");
const Routes = Router();
const UserLoginController = require("../Controllers/UserLoginController");
const authMiddleware = require('../Middleware/authMiddleware');
const authenticateToken = require('../Middleware/authenticateToken');


Routes.post("/registerUser", UserLoginController.register);
Routes.post("/loginUser", UserLoginController.login);
Routes.get("/profile", authenticateToken, UserLoginController.getProfile);
Routes.put("/profile/update", authenticateToken, UserLoginController.updateProfile);
Routes.get("/all-users", authMiddleware, UserLoginController.getAllUsers);
module.exports = Routes;


