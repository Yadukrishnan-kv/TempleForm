const express = require('express');
const router = express.Router();
const districtController = require('../Controllers/DistrictController');

// CRUD operations for districts
router.post('/createDistrict', districtController.createDistrict);
router.get('/getAllDistricts', districtController.getAllDistricts);
router.put('/updateDistrict/:id', districtController.updateDistrict);
router.delete('/deleteDistrict/:id', districtController.deleteDistrict);

module.exports = router;
