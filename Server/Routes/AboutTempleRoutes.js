const express = require('express');
const router = express.Router();
const aboutTempleController = require('../Controllers/AboutTempleController');

// CRUD operations for about temple
router.post('/createaboutTemple', aboutTempleController.addDescription);
router.get('/getAllaboutTemple/:templeId', aboutTempleController.getDescriptions);
router.put('/updateaboutTemple/:id', aboutTempleController.updateDescription);
router.delete('/deleteaboutTemple/:id', aboutTempleController.deleteDescription);

module.exports = router;

