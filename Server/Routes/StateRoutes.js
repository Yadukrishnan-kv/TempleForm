const express = require('express');
const router = express.Router();
const stateController = require('../Controllers/StateController');

// CRUD operations for states
router.post('/createState', stateController.createState);
router.get('/getAllStates', stateController.getAllStates);
router.put('/updateState/:id', stateController.updateState);
router.delete('/deleteState/:id', stateController.deleteState);

module.exports = router;
