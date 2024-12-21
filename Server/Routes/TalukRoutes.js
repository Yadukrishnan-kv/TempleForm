const express = require('express');
const router = express.Router();
const talukController = require('../Controllers/TalukController');

// CRUD operations for taluks
router.post('/createTaluk', talukController.createTaluk);
router.get('/getAllTaluks', talukController.getAllTaluks);
router.put('/updateTaluk/:id', talukController.updateTaluk);
router.delete('/deleteTaluk/:id', talukController.deleteTaluk);

module.exports = router;
