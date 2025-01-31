const express = require('express');
const router = express.Router();
const poojaController = require('../Controllers/PoojaController');
const authenticateToken = require('../Middleware/authenticateToken');


router.post('/CreatePooja',authenticateToken, poojaController.createPooja);
router.get("/GetPoojas", authenticateToken, poojaController.getPoojas)
router.get('/getTempleInfo', authenticateToken, poojaController.getTempleInfo);
router.put('/UpdatePooja/:id',authenticateToken, poojaController.updatePooja);
router.delete('/DeletePooja/:id', poojaController.deletePooja);
router.get("/GetPoojas/:templeId", poojaController.getPoojasByTempleId)

module.exports = router;