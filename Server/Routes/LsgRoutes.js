const express = require('express');
const router = express.Router();
const {
  createLsg,
  getAllLsgs,
  updateLsg,
  deleteLsg,
} = require('../Controllers/LsgController'); // adjust path as needed

router.post('/createlsg', createLsg);
router.get('/getAllLsgs', getAllLsgs);
router.put('/updateLsg/:id', updateLsg);
router.delete('/deleteLsg/:id', deleteLsg);

module.exports = router;
