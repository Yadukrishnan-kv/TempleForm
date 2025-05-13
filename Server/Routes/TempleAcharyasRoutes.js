const express = require('express');
const router = express.Router();
const { createFormData, getAllFormData,updateFormData,deleteFormData,createRole, getAllRoles,updateRole,deleteRole} = require('../Controllers/TempleAcharyasController');
const upload = require('../Config/multer');

router.post('/createTempleAcharyas', upload.single('image'), createFormData);
router.get('/getTempleAcharyas', getAllFormData);
router.put('/updateTempleAcharyas/:id', upload.single('image'), updateFormData);
router.delete('/deleteTempleAcharyas/:id', deleteFormData);


router.post('/createTempleAcharyasrole', createRole);
router.get('/getTempleAcharyasrole', getAllRoles);
router.put('/editTempleAcharyasrole/:id', updateRole);
router.delete('/deleteTempleAcharyasrole/:id', deleteRole);
module.exports = router;
