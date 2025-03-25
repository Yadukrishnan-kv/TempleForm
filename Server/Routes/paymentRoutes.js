const express = require("express")
const router = express.Router()
const paymentController = require("../Controllers/paymentController")
const authMiddleware = require("../Middleware/authMiddleware") // Assuming you have this middleware

// Create a new payment
router.post("/create-payment", paymentController.createPayment)

// Verify payment after completion
router.post("/verify-payment", paymentController.verifyPayment)

// Get subscription details by order ID
router.get("/payment/:orderId", paymentController.getSubscriptionDetails)

// Get all subscriptions for a temple by email
router.get("/temple-subscriptions/:templeId", paymentController.getSubscriptionByEmail)

// Download invoice
router.get("/:offlineSubscriptions/invoice", paymentController.downloadInvoice)
router.get('/offlineSubscriptions/invoice/:id', paymentController.downloadInvoice);




router.post("/create-offlinesubscription", paymentController.createSubscription)




module.exports = router




