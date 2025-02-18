const { Router } = require("express");
const Routes = Router();
const UserLoginController = require("../Controllers/UserLoginController");
const authMiddleware = require('../Middleware/authMiddleware');
const authenticateToken = require('../Middleware/authenticateToken');


Routes.post("/registerUser", UserLoginController.register);
Routes.post("/verify-otp", UserLoginController.verifyemail);

Routes.post("/loginUser", UserLoginController.login);
Routes.post("/forgot-password", UserLoginController.forgotPassword);
Routes.post("/reset-password", UserLoginController.resetPassword);
Routes.get("/profile", authenticateToken, UserLoginController.getProfile);
Routes.put("/profile/update", authenticateToken, UserLoginController.updateProfile);
Routes.get("/all-users", authMiddleware, UserLoginController.getAllUsers);
Routes.delete("/delete-users/:userId", authMiddleware, UserLoginController.deleteUser)
module.exports = Routes;


