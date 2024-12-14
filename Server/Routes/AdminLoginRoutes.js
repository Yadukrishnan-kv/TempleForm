const {Router}=require("express")
const Routes=Router()
const AdminController=require("../Controllers/AdminLoginController")
Routes.post("/register",AdminController.register)
Routes.post("/login",AdminController.login)

module.exports=Routes