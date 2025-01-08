const { Router } = require("express")
const Routes = Router()
const AdminController = require("../Controllers/AdminLoginController")
const authMiddleware = require('../Middleware/authMiddleware');

Routes.post("/register", AdminController.register)
Routes.post("/login", AdminController.login)
Routes.get("/profile", authMiddleware, AdminController.getProfile);
Routes.put("/profileUpdate", authMiddleware, AdminController.updateProfile);
Routes.post("/addSubadmin", authMiddleware, AdminController.addSubadmin);
Routes.get("/users", authMiddleware, AdminController.getUsers);
Routes.get("/roles", authMiddleware, AdminController.getRoles);
Routes.get('/roles-permissions', authMiddleware, AdminController.getRolesWithPermissions);

Routes.put("/editSubadmin/:id", authMiddleware, AdminController.editSubadmin);
Routes.delete("/deleteSubadmin/:id", authMiddleware, AdminController.deleteSubadmin);
Routes.put('/updateRolePermissions', authMiddleware, AdminController.updateRolePermissions);
module.exports = Routes