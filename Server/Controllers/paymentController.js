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

    // Generate invoice number dynamically
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const invoiceNumber = String(subscription.invoiceNumber || 0).padStart(6, "0")
    const invoiceId = `SSD-${year}-${month}/${invoiceNumber}`

    // Increment invoice number for the next invoice
    const nextInvoiceNumber = parseInt(invoiceNumber) + 1
    subscription.invoiceNumber = nextInvoiceNumber
    await subscription.save()

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    res.setHeader("Content-disposition", `attachment; filename=invoice_${subscription._id}.pdf`)
    res.setHeader("Content-type", "application/pdf")

    // Pipe the PDF to response
    doc.pipe(res)

 // Load and embed logo if available
const logoPath = path.join(__dirname, "../assets/images/logo.png")
if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 50, 45, { width: 100 }) // Logo at (50, 45)
}

// Move down after logo for spacing
doc.moveDown(4) // Add some space after the logo

// Header Section
doc
  .font("Helvetica-Bold")
  .fontSize(16)
  .fillColor("#333")
  .text("SREESHUDDHI", 50, doc.y, { align: "left" }) // Positioned below logo
  .fontSize(10)
  .fillColor("#666")
  .text("Kalady, Kerala, India - 683574", 50, doc.y, { align: "left" })
  .text("Phone: +91 98470 47963", 50, doc.y, { align: "left" })
  .moveDown(1) // Space after header section

// Bill To Section
doc
  .fontSize(10)
  .fillColor("#444")
  .text("Bill To:", 50, doc.y) // Placed after header section
  .font("Helvetica-Bold")
  .text(subscription.templeName, { continued: true }) // Same line as "Bill To:"
  .font("Helvetica")
  .text(`\n${subscription.address}\n${subscription.number}\n${subscription.email}`) // Multi-line content
  .moveDown(1)



    // Invoice Title Section
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#000")
      .text("INVOICE", 400, 50, { align: "right" })
      .fontSize(12)
      .fillColor("#666")
      .text(`# ${invoiceId}`, { align: "right" })
      .moveDown(0)

    // Status Section
   // Status Section (Always "PAID" with no color change)
   doc
   .fontSize(12)
   .fillColor("#000") // Black or default text color
   .text("PAID", { align: "right" }) // Status is always PAID
   .moveDown(2) // Increased space after "PAID"
 
 // Invoice Date and Due Date
 doc
   .font("Helvetica")
   .fontSize(10)
   .text(`Invoice Date: ${new Date(subscription.startDate).toDateString()}`, 400, 160, {
     align: "right",
   })
   .text(`Due Date: ${new Date(subscription.endDate).toDateString()}`, { align: "right" })
   .moveDown(5)
 
// Move the table down by increasing the Y-axis position
const tableStartY = 250 // Moved down from 220 to 300

// Table Header with Increased Width and Reduced Spacing
doc
  .rect(50, tableStartY, 520, 20) // Increased width by 20px
  .fill("#4d628c")
  .fillColor("#fff")
  .font("Helvetica-Bold")
  .fontSize(10)
  .text("#", 55, tableStartY + 5, { width: 30, align: "left" }) // Reduced width
  .text("Description", 85, tableStartY + 5, { width: 180, align: "left" }) // Reduced width slightly
  .text("Amount", 290, tableStartY + 5, { width: 70, align: "right" })
  .text("GST (18%)", 370, tableStartY + 5, { width: 70, align: "right" })
  .text("Total Amount", 460, tableStartY + 5, { width: 90, align: "right" })

doc
  .moveTo(50, tableStartY + 20)
  .lineTo(570, tableStartY + 20) // Updated to match the increased width
  .stroke()

// Table Row with Updated Width and Reduced Spacing
doc
  .fillColor("#000")
  .font("Helvetica")
  .fontSize(10)
  .text("1", 55, tableStartY + 35, { width: 30, align: "left" })
  .text("Subscription Charges", 85, tableStartY + 35, { width: 180, align: "left" })
  .text("1000.00", 290, tableStartY + 35, { width: 70, align: "right" })
  .text("180.00", 370, tableStartY + 35, { width: 70, align: "right" })
  .text(`${subscription.totalAmount}`, 460, tableStartY + 35, { width: 90, align: "right" })

doc
  .moveTo(50, tableStartY + 50)
  .lineTo(570, tableStartY + 50) // Updated to match the increased width
  .stroke()

  doc
  .rect(50, tableStartY + 80, 520, 20) // Full width background
  .fill("#eee")
  .fillColor("#000")
  .font("Helvetica-Bold")
  .fontSize(10)
  .text("Total Amount:", 420, tableStartY + 85, { width: 100, align: "right" }) // Moved 50px left
  .text(`${subscription.totalAmount}`, 480, tableStartY + 85, { width: 70, align: "right" }) // Moved 50px left



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

