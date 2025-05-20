const express = require('express');
const router = express.Router();
const selectedLsgController = require('../Controllers/SelectedLsgController');

router.post('/createSelectedLsg', selectedLsgController.createSelectedLsg);
router.get('/getAllSelectedLsgs', selectedLsgController.getAllSelectedLsgs);
router.put('/updateSelectedLsg/:id', selectedLsgController.updateSelectedLsg);
router.delete('/deleteSelectedLsg/:id', selectedLsgController.deleteSelectedLsg);

module.exports = router;
