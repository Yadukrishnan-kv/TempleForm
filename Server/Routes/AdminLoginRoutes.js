const {Router}=require("express")
const Routes=Router()
const AdminController=require("../Controllers/AdminLoginController")
const authMiddleware = require('../Middleware/authMiddleware');
Routes.post("/register",AdminController.register)
Routes.post("/login",AdminController.login)
Routes.get("/profile", authMiddleware, AdminController.getProfile);
Routes.put("/profileUpdate", authMiddleware, AdminController.updateProfile);

module.exports=Routes