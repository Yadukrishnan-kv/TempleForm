const Subscription = require("../Models/Subscription")
const axios = require("axios")
const crypto = require("crypto")
const PDFDocument = require("pdfkit")

const fs = require("fs")
const pdf = require('html-pdf');
const path = require('path');
require("dotenv").config()


const API_URL = process.env.OMNIWARE_API_URL
const API_KEY = process.env.OMNIWARE_API_KEY
const MERCHANT_ID = process.env.OMNIWARE_MERCHANT_ID
const SECRET = process.env.OMNIWARE_SECRET
const FRONTEND_URL = process.env.FRONTEND_URL

// Generate secure signature
const generateSignature = (payload) => {
  const payloadString = JSON.stringify(payload)
  return crypto.createHmac("sha256", SECRET).update(payloadString).digest("hex")
}

// Create a payment order
const createPayment = async (req, res) => {
  try {
    const { userId, orderId, templeDetails } = req.body

    // Validate required fields
    if (!templeDetails.templeName || !templeDetails.email || !templeDetails.phone) {
      return res.status(400).json({
        success: false,
        message: "Temple name, email, and phone are required",
      })
    }

    // Create payload for Omniware
    const payload = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      amount: templeDetails.totalAmount.toFixed(2),
      currency: "INR",
      user_id: userId,
      redirect_url: `${FRONTEND_URL}/payment-success`,
      cancel_url: `${FRONTEND_URL}/payment-failure`,
    }

    const signature = generateSignature(payload)

    // Create subscription record in database
    const subscription = new Subscription({
      templeName: templeDetails.templeName,
      email: templeDetails.email,
      phone: templeDetails.phone,
      amount: templeDetails.amount,
      gst: templeDetails.gst,
      totalAmount: templeDetails.totalAmount,
      orderId: orderId,
      paymentStatus: "Pending",
      startDate: new Date(), // Set start date to now
      // The endDate will be set by the pre-save hook in the Subscription model
    })

    await subscription.save()

    // Call Omniware API to create payment
    const response = await axios.post(`${API_URL}/create-order`, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "x-signature": signature,
      },
    })

    if (response.data.status === "success") {
      res.status(200).json({
        success: true,
        paymentUrl: response.data.payment_url,
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Payment creation failed",
        error: response.data.message,
      })
    }
  } catch (error) {
    console.error("Error creating payment:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    })
  }
}

// Verify payment after completion
const verifyPayment = async (req, res) => {
  try {
    const { transactionId, orderId } = req.body

    // Find the subscription in our database
    const subscription = await Subscription.findOne({ orderId })

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      })
    }

    // Verify payment with Omniware
    const payload = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      transaction_id: transactionId,
    }

    const signature = generateSignature(payload)

    const response = await axios.post(`${API_URL}/verify-payment`, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "x-signature": signature,
      },
    })

    if (response.data.status === "success") {
      // Update subscription status
      subscription.paymentStatus = "Paid"
      subscription.transactionId = transactionId
      await subscription.save()

      // Generate invoice
      await generateInvoice(subscription)

      return res.status(200).json({
        success: true,
        subscription: {
          templeName: subscription.templeName,
          amount: subscription.amount,
          gst: subscription.gst,
          totalAmount: subscription.totalAmount,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          transactionId: subscription.transactionId,
          orderId: subscription.orderId,
        },
      })
    } else {
      // Update subscription status to failed
      subscription.paymentStatus = "Failed"
      await subscription.save()

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    })
  }
}

// Get subscription details
const getSubscriptionDetails = async (req, res) => {
  try {
    const { orderId } = req.params

    const subscription = await Subscription.findOne({ orderId })

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      })
    }

    return res.status(200).json({
      success: true,
      subscription: {
        templeName: subscription.templeName,
        email: subscription.email,
        phone: subscription.phone,
        amount: subscription.amount,
        gst: subscription.gst,
        totalAmount: subscription.totalAmount,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        paymentStatus: subscription.paymentStatus,
        transactionId: subscription.transactionId,
        orderId: subscription.orderId,
        invoiceUrl: subscription.invoiceUrl,
      },
    })
  } catch (error) {
    console.error("Error fetching subscription details:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription details",
      error: error.message,
    })
  }
}

// Get all subscriptions for a temple by email
const getTempleSubscriptions = async (req, res) => {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const subscriptions = await Subscription.find({ email }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      subscriptions,
    })
  } catch (error) {
    console.error("Error fetching temple subscriptions:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch temple subscriptions",
      error: error.message,
    })
  }
}

// Generate invoice
const generateAndDownloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params

    // Fetch subscription details from DB
    const subscription = await Subscription.findOne({ orderId })

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      })
    }

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${orderId}.pdf`
    )

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 })

    // Pipe PDF to response stream
    doc.pipe(res)

    // Add content to the PDF
    doc.fontSize(20).text("INVOICE", { align: "center" })
    doc.moveDown()

    // Company Info
    doc.fontSize(12).text("Temple Subscription Services", { align: "left" })
    doc.fontSize(10).text("123 Temple Street, City, State, PIN", { align: "left" })
    doc.fontSize(10).text("GSTIN: 12ABCDE1234F1Z5", { align: "left" })
    doc.moveDown()

    // Invoice Details
    doc
      .fontSize(12)
      .text(`Invoice Number: INV-${subscription.transactionId || subscription.orderId}`, { align: "left" })
    doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" })
    doc.moveDown()

    // Customer Details
    doc.fontSize(12).text("Customer Details:", { align: "left" })
    doc.fontSize(10).text(`Temple Name: ${subscription.templeName}`, { align: "left" })
    doc.fontSize(10).text(`Email: ${subscription.email}`, { align: "left" })
    doc.fontSize(10).text(`Phone: ${subscription.phone}`, { align: "left" })
    doc.moveDown()

    // Subscription Details
    doc.fontSize(12).text("Subscription Details:", { align: "left" })
    doc.fontSize(10).text(`Start Date: ${new Date(subscription.startDate).toLocaleDateString()}`, { align: "left" })
    doc.fontSize(10).text(`End Date: ${new Date(subscription.endDate).toLocaleDateString()}`, { align: "left" })
    doc.moveDown()

    // Table Header
    doc.fontSize(10)
    const tableTop = doc.y
    doc.text("Description", 50, tableTop)
    doc.text("Amount (₹)", 400, tableTop, { width: 90, align: "right" })
    doc.moveDown()

    // Draw Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Table Content
    doc.text("Annual Subscription", 50, doc.y)
    doc.text(subscription.amount.toFixed(2), 400, doc.y, { width: 90, align: "right" })
    doc.moveDown()

    doc.text("GST (18%)", 50, doc.y)
    doc.text(subscription.gst.toFixed(2), 400, doc.y, { width: 90, align: "right" })
    doc.moveDown()

    // Draw Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Total Amount
    doc.fontSize(12).text("Total Amount", 50, doc.y)
    doc.fontSize(12).text(subscription.totalAmount.toFixed(2), 400, doc.y, { width: 90, align: "right" })
    doc.moveDown()

    // Payment Info
    doc.moveDown()
    doc.fontSize(10).text("Payment Information:", { align: "left" })
    doc.fontSize(10).text(`Transaction ID: ${subscription.transactionId || "Pending"}`, { align: "left" })
    doc.fontSize(10).text(`Payment Status: ${subscription.paymentStatus.toUpperCase()}`, { align: "left" })
    doc.moveDown()

    // Footer
    doc.fontSize(10).text("Thank you for your subscription!", { align: "center" })
    doc
      .fontSize(8)
      .text("This is a computer-generated invoice and does not require a signature.", { align: "center" })

    // Finalize the PDF
    doc.end()

    // Handle stream errors
    res.on("error", (err) => {
      console.error("Stream error:", err)
      res.status(500).send("Failed to generate and download invoice.")
    })
  } catch (error) {
    console.error("Error generating and downloading invoice:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate and download invoice",
      error: error.message,
    })
  }
}


//offline payment// 


const createSubscription = async (req, res) => {
  try {
    const { templeName,templeId, address, email, number } = req.body;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 12); // 12 months duration

    const subscription = new Subscription({
      templeName,
      templeId,
      address,
      email,
      number,
      startDate,
      endDate,
      amount: 1000,
      gst: 180,
      totalAmount: 1180,
    });

    await subscription.save();
    res.status(201).json({ message: 'Subscription added successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSubscriptionByEmail = async (req, res) => {
  try {
    const { templeId } = req.params;
    const subscriptions = await Subscription.find({ templeId });
    if (!subscriptions.length) {
      return res.status(404).json({ message: 'No subscription found for this email' });
    }
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  const { id } = req.params

  try {
    const subscription = await Subscription.findById(id)

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }

    // Read logo file and convert to base64
    const logoPath = path.join(__dirname, "../assets/images/logo.png")
    let logoBase64 = ""
    try {
      const logoData = fs.readFileSync(logoPath)
      logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`
    } catch (err) {
      console.error("Error reading logo file:", err)
    }

    // Generate invoice number dynamically
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const invoiceNumber = String(subscription.invoiceNumber || 0).padStart(6, "0")

    // Increment invoice number for the next invoice
    const nextInvoiceNumber = parseInt(invoiceNumber) + 1
    subscription.invoiceNumber = nextInvoiceNumber
    await subscription.save()

    const invoiceId = `SSD-${year}-${month}/${invoiceNumber}`

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    res.setHeader("Content-disposition", `attachment; filename=invoice_${subscription._id}.pdf`)
    res.setHeader("Content-type", "application/pdf")

    // Pipe the PDF to response
    doc.pipe(res)

    // Add Logo
    if (logoBase64) {
      const logoBuffer = Buffer.from(logoBase64.split(",")[1], "base64")
      doc.image(logoBuffer, 50, 45, { width: 100 }).moveDown(1)
    }

    // Add Company Info
    doc
      .fontSize(20)
      .text("SREESHUDDHI", 50, 50, { align: "right" })
      .fontSize(10)
      .text("Kalady, Kerala, India - 683574", { align: "right" })
      .text("Phone: +91 98470 47963", { align: "right" })
      .moveDown(1)

    // Invoice Title & Number
    doc
      .fontSize(20)
      .text("INVOICE", { align: "left" })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Invoice Number: ${invoiceId}`)
      .text(`Invoice Date: ${new Date(subscription.startDate).toDateString()}`)
      .text(`Due Date: ${new Date(subscription.endDate).toDateString()}`)
      .moveDown(1)

    // Customer Info
    doc
      .fontSize(14)
      .text("Bill To:", { underline: true })
      .fontSize(12)
      .text(subscription.templeName)
      .text(subscription.address)
      .text(subscription.number)
      .text(subscription.email)
      .moveDown(1)

    // Table Header
    doc
      .fontSize(12)
      .text("#", 50, 300, { width: 50, align: "left" })
      .text("Description", 100, 300, { width: 200, align: "left" })
      .text("Amount", 300, 300, { width: 100, align: "right" })
      .text("GST (18%)", 400, 300, { width: 100, align: "right" })
      .text("Total Amount", 500, 300, { width: 100, align: "right" })
      .moveDown(0.5)

    doc
      .moveTo(50, 315)
      .lineTo(550, 315)
      .stroke()

    // Table Row
    doc
      .fontSize(12)
      .text("1", 50, 330, { width: 50, align: "left" })
      .text("Subscription Charges", 100, 330, { width: 200, align: "left" })
      .text("₹1000.00", 300, 330, { width: 100, align: "right" })
      .text("₹180.00", 400, 330, { width: 100, align: "right" })
      .text(`₹${subscription.totalAmount}`, 500, 330, { width: 100, align: "right" })

    doc
      .moveTo(50, 345)
      .lineTo(550, 345)
      .stroke()

    // Total Amount Section
    doc
      .fontSize(12)
      .text("Total Amount:", 400, 380, { width: 100, align: "right" })
      .text(`₹${subscription.totalAmount}`, 500, 380, { width: 100, align: "right" })
      .moveDown(2)

    doc
      .fontSize(10)
      .fillColor("#444444")
      .text(
        "Thank you for your subscription. If you have any questions regarding this invoice, please contact us.",
        50,
        450,
        { align: "center" }
      )

    // Finalize PDF
    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Get formatted invoice number for display
const getInvoiceNumber = (req, res) => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, "0") // Month in 2 digits
  const invoiceNumber = String(21).padStart(6, "0") // Example invoice number

  // Generate invoice format: SSD-YYYY-MM/0000XX
  const invoiceId = `SSD-${year}-${month}/${invoiceNumber}`

  res.json({ invoiceId })
}


module.exports = {
  createPayment,
  verifyPayment,
  getSubscriptionDetails,
  getTempleSubscriptions,
  generateAndDownloadInvoice,
  createSubscription,getSubscriptionByEmail,downloadInvoice,getInvoiceNumber
}

