const Subscription = require("../Models/Subscription")
const crypto = require("crypto")
require("dotenv").config()
const moment = require("moment")
const { v4: uuidv4 } = require("uuid")
const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")
const SALT = process.env.OMNIWARE_SALT

const createPaymentHash = (reqData) => {
  const shasum = crypto.createHash("sha512")
  let hashData = SALT
  const hashColumns = [
    "address_line_1",
    "address_line_2",
    "amount",
    "api_key",
    "city",
    "country",
    "currency",
    "description",
    "email",
    "mode",
    "name",
    "order_id",
    "phone",
    "return_url",
    "state",
    "zip_code",
  ]

  hashColumns.forEach((entry) => {
    if (entry in reqData && reqData[entry]) {
      // Trim the value before appending
      hashData += "|" + String(reqData[entry]).trim()
    }
  })

  return shasum.update(hashData).digest("hex").toUpperCase()
}

// Helper function to get next invoice number
const getNextInvoiceNumber = async () => {
  try {
    // Find the subscription with the highest invoice number
    const lastSubscription = await Subscription.findOne({}, {}, { sort: { invoiceNumber: -1 } })

    if (!lastSubscription || !lastSubscription.invoiceNumber) {
      return 1 // Start with 1 if no subscriptions exist
    }

    return lastSubscription.invoiceNumber + 1
  } catch (error) {
    console.error("Error getting next invoice number:", error)
    return 1 // Default to 1 if there's an error
  }
}

const paymentRequest = async (req, res) => {
  const reqData = req.body

  const { amount, address_line_1, city, name, email, phone, order_id, currency, description, country, return_url } =
    reqData

  const apiKey = process.env.OMNIWARE_API_KEY

  if (
    !amount ||
    !address_line_1 ||
    !city ||
    !name ||
    !email ||
    !phone ||
    !order_id ||
    !currency ||
    !description ||
    !country ||
    !return_url
  ) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  reqData.api_key = apiKey

  const existingSubscription = await Subscription.findOne({ email })

  if (existingSubscription && new Date(existingSubscription.endDate) > new Date()) {
    return res.status(400).json({ error: "Already Subscribed.Come back when it ends" })
  }
  const resultKey = createPaymentHash(reqData)
  return res.json({ data: resultKey })
}

const paymentResponse = async (req, res) => {
  const reqData = req.body

  console.log("Incoming payment response data:", reqData)

  const shasum = crypto.createHash("sha512")
  let hashData = process.env.OMNIWARE_SALT

  const keys = Object.keys(reqData).sort()
  keys.forEach((k) => {
    if (k !== "hash" && reqData[k]) {
      hashData += "|" + reqData[k].toString()
    }
  })

  const calculatedHash = shasum.update(hashData).digest("hex").toUpperCase()
  console.log("Calculated Hash for Response:", calculatedHash)

  if (reqData["hash"] === calculatedHash) {
    if (reqData["response_code"] === "0") {
      // Payment success
      const endDate = moment().add(365, "days").toDate()

      // Get next invoice number
      const invoiceNumber = await getNextInvoiceNumber()

      const subscription = new Subscription({
        orderId: reqData["order_id"],
        templeId: reqData["address_line_2"],
        templeName: reqData["name"],
        address: reqData["address_line_1"],
        email: reqData["email"],
        number: reqData["phone"],
        amount: Number.parseFloat(reqData["amount"]),
        transactionId: reqData["transaction_id"],
        paymentStatus: "Paid",
        endDate: endDate,
        invoiceNumber: invoiceNumber, // Set invoice number during subscription creation
      })

      try {
        await subscription.save()
        console.log("✅ Subscription saved successfully with invoice number:", invoiceNumber)
        return res.redirect(`${process.env.FRONTEND_URL}/subscription-success`)
      } catch (error) {
        console.error("❌ Error saving subscription:", error)
        // If saving fails, redirect to failure page
        return res.redirect(`${process.env.FRONTEND_URL}/subscription-failed`)
      }
    } else {
      console.error("❌ Payment Failed:", reqData["response_message"])
      return res.redirect(`${process.env.FRONTEND_URL}/subscription-failed`)
    }
  } else {
    console.error("❌ Hash Mismatch!")
    return res.redirect(`${process.env.FRONTEND_URL}/subscription-failed`)
  }
}

//offline payment//
const createOfflineSubscription = async (req, res) => {
  try {
    const { templeName, templeId, address, email, number } = req.body

    // Check if the user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      email,
      templeId,
      endDate: { $gt: new Date() }, // Check if there is an active subscription (endDate > current date)
    })

    if (existingSubscription) {
      return res.status(400).json({
        message: "You already have an active subscription. Please renew after the current subscription ends.",
      })
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)

    const orderId = `ORD-${Date.now()}`
    const transactionId = `TXN-${uuidv4()}`

    // Get next invoice number
    const invoiceNumber = await getNextInvoiceNumber()

    const subscription = new Subscription({
      orderId,
      transactionId,
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
      paymentStatus: "Paid", // ✅ SET TO PAID
      invoiceNumber: invoiceNumber, // Set invoice number during subscription creation
    })

    await subscription.save()
    console.log("✅ Offline subscription created with invoice number:", invoiceNumber)

    res.status(201).json({ message: "Offline subscription created and marked as Paid", subscription })
  } catch (error) {
    console.error("Subscription creation failed:", error.message)
    res.status(500).json({ message: error.message })
  }
}

const getSubscriptionByEmail = async (req, res) => {
  try {
    const { templeId } = req.params
    const subscriptions = await Subscription.find({ templeId })
    if (!subscriptions.length) {
      return res.status(404).json({ message: "No subscription found for this email" })
    }
    res.status(200).json(subscriptions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
    if (!subscriptions.length) {
      return res.status(404).json({ message: "No subscriptions found" })
    }
    res.status(200).json(subscriptions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const downloadInvoice = async (req, res) => {
  const { id } = req.params

  try {
    // Simply find the subscription without incrementing anything
    const subscription = await Subscription.findById(id)

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }

    // Use the existing invoice number (no increment during download)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const invoiceNumber = String(subscription.invoiceNumber || 1).padStart(6, "0")
    const invoiceId = `SSD-${year}-${month}/${invoiceNumber}`

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    res.setHeader(
      "Content-disposition",
      `attachment; filename=invoice_${subscription._id}_${subscription.invoiceNumber}.pdf`,
    )
    res.setHeader("Content-type", "application/pdf")

    // Pipe the PDF to response
    doc.pipe(res)

    // Load and embed logo if available
    const logoPath = path.join(__dirname, "../assets/images/logo.png")
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 100 })
    }

    // Move down after logo for spacing
    doc.moveDown(4)

    // Header Section
    doc
  .font("Helvetica-Bold")
  .fontSize(16)
  .fillColor("#333")
  .text("SREESHUDDHI", 50, doc.y, { align: "left" })
  .fontSize(10)
  .fillColor("#666")
  .text("Kalady, Kerala, India - 683574", 50, doc.y, { align: "left" })
  .text("Phone: +91 98470 47963", 50, doc.y, { align: "left" })
  .text("GSTIN/UIN: 32ABMCSO845D1ZK", 50, doc.y, { align: "left" })
  .moveDown(1);


    // Bill To Section
    doc
      .fontSize(10)
      .fillColor("#444")
      .text("Bill To:", 50, doc.y)
      .font("Helvetica-Bold")
      .text(subscription.templeName, { continued: true })
      .font("Helvetica")
      .text(`\n${subscription.address}\n${subscription.number}`)
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
    doc.fontSize(12).fillColor("#000").text("PAID", { align: "right" }).moveDown(2)

    // Invoice Date
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Invoice Date: ${new Date(subscription.startDate).toDateString()}`, 400, 160, {
        align: "right",
      })
      .moveDown(5)

    // Table
    const tableStartY = 250

    // Table Header
    doc
      .rect(50, tableStartY, 520, 20)
      .fill("#4d628c")
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("#", 55, tableStartY + 5, { width: 30, align: "left" })
      .text("Description", 85, tableStartY + 5, { width: 180, align: "left" })
      .text("Amount", 290, tableStartY + 5, { width: 70, align: "right" })
      .text("GST (18%)", 370, tableStartY + 5, { width: 70, align: "right" })
      .text("Total Amount", 460, tableStartY + 5, { width: 90, align: "right" })

    doc
      .moveTo(50, tableStartY + 20)
      .lineTo(570, tableStartY + 20)
      .stroke()

    // Table Row
    doc
      .fillColor("#000")
      .font("Helvetica")
      .fontSize(10)
      .text("1", 55, tableStartY + 35, { width: 30, align: "left" })
      .text("Membership For Registration", 85, tableStartY + 35, { width: 180, align: "left" })
      .text("1000.00", 290, tableStartY + 35, { width: 70, align: "right" })
      .text("180.00", 370, tableStartY + 35, { width: 70, align: "right" })
      .text(`${subscription.totalAmount}`, 460, tableStartY + 35, { width: 90, align: "right" })

    doc
      .moveTo(50, tableStartY + 50)
      .lineTo(570, tableStartY + 50)
      .stroke()

    // Total
    doc
      .rect(50, tableStartY + 80, 520, 20)
      .fill("#eee")
      .fillColor("#000")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Total Amount:", 420, tableStartY + 85, { width: 100, align: "right" })
      .text(`${subscription.totalAmount}`, 480, tableStartY + 85, { width: 70, align: "right" })

    // Finalize PDF
    doc.end()
  } catch (error) {
    console.error("Invoice generation error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Remove the getInvoiceNumber function as it's no longer needed
// since we're not incrementing during download

module.exports = {
  paymentRequest,
  paymentResponse,
  createOfflineSubscription,
  getSubscriptionByEmail,
  downloadInvoice,
  getAllSubscriptions,
}
