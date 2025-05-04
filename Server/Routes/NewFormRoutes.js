const express = require('express');
const router = express.Router();
const { createFormData, getAllFormData,updateFormData,deleteFormData,createRole, getAllRoles,updateRole,deleteRole} = require('../Controllers/NewFormController');
const upload = require('../Config/multer');

router.post('/createnewform', upload.single('image'), createFormData);
router.get('/getnewform', getAllFormData);
router.put('/updateform/:id', upload.single('image'),updateFormData);
router.delete('/deleteform/:id', deleteFormData);


router.post('/createnewrole', createRole);
router.get('/getnewrole', getAllRoles);
router.put('/editnewrole/:id', updateRole);
router.delete('/deletenewrole/:id', deleteRole);
module.exports = router;
