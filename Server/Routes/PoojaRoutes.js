const express = require('express');
const router = express.Router();
const poojaController = require('../Controllers/PoojaController');
const authenticateToken = require('../Middleware/authenticateToken');


router.post('/CreatePooja',authenticateToken, poojaController.createPooja);
router.put('/UpdatePooja/:id',authenticateToken, poojaController.updatePooja);
router.delete('/DeletePooja/:id', poojaController.deletePooja);

module.exports = router;