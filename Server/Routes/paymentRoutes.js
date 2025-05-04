const express = require("express")
const router = express.Router()
const paymentController = require("../Controllers/paymentController")





router.post("/paymentRequest", paymentController.paymentRequest);
router.post("/paymentResponse", paymentController.paymentResponse)
router.get('/getallsubscriptions',paymentController. getAllSubscriptions);




// Download invoice
router.get("/:offlineSubscriptions/invoice", paymentController.downloadInvoice)
router.get('/offlineSubscriptions/invoice/:id', paymentController.downloadInvoice);
router.post("/create-offlinesubscription", paymentController.createOfflineSubscription)
router.get("/temple-subscriptions/:templeId", paymentController.getSubscriptionByEmail)





module.exports = router




