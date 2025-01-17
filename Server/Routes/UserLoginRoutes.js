const { Router } = require("express")
const Routes = Router()
const UserLoginController = require("../Controllers/UserLoginController")
const authMiddleware = require('../Middleware/authMiddleware');

Routes.post("/registerUser", UserLoginController.register)
Routes.post("/loginUser", UserLoginController.login)



module.exports = Routes