const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/ContactUsController');

router.post('/Contactsubmit', contactController.submitContact);
router.get('/enquiries', contactController.getContacts);

module.exports = router;