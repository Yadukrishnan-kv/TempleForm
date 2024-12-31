const express = require('express');
const router = express.Router();
const aboutTempleController = require('../Controllers/AboutTempleController');

// CRUD operations for states
router.post('/createaboutTemple', aboutTempleController.addDescription);
router.get('/getAllaboutTemple/templeId', aboutTempleController.getDescriptions);
router.put('/updateaboutTemple/:templeId', aboutTempleController.updateDescription);
router.delete('/deleteaboutTemple/templeId', aboutTempleController.deleteDescription);

module.exports = router;