const express = require("express")
const router = express.Router()
const paymentController = require("../Controllers/paymentController")
const authenticateToken = require('../Middleware/authenticateToken');





router.post("/create-subscription",authenticateToken, paymentController.createonlineSubscription);
router.post("/verify-payment", paymentController.verifyPayment)




// Download invoice
router.get("/:offlineSubscriptions/invoice", paymentController.downloadInvoice)
router.get('/offlineSubscriptions/invoice/:id', paymentController.downloadInvoice);
router.post("/create-offlinesubscription", paymentController.createOfflineSubscription)
router.get("/temple-subscriptions/:templeId", paymentController.getSubscriptionByEmail)





module.exports = router




