const Subscription = require("../Models/Subscription");
const crypto = require("crypto");
require("dotenv").config();
const moment = require('moment');
const { v4: uuidv4 } = require('uuid'); 
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const SALT = process.env.OMNIWARE_SALT;

const createPaymentHash = (reqData) => {
  const shasum = crypto.createHash('sha512');
  let hashData = SALT;
  const hashColumns = [
    "address_line_1", "address_line_2", "amount", "api_key", "city", "country",
    "currency", "description", "email", "mode", "name", "order_id", "phone",
    "return_url", "state", "zip_code"
  ];

  hashColumns.forEach(entry => {
    if (entry in reqData && reqData[entry]) {
      // Trim the value before appending
      hashData += '|' + String(reqData[entry]).trim();
    }
  });

  return shasum.update(hashData).digest('hex').toUpperCase();
};


const paymentRequest = async (req, res) => {
  const reqData = req.body;

  const {
    amount, address_line_1, city, name, email, phone,
    order_id, currency, description, country, return_url
  } = reqData;

  const apiKey = process.env.OMNIWARE_API_KEY;

  if (!amount || !address_line_1 || !city || !name || !email || !phone || !order_id || !currency || !description || !country || !return_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  reqData.api_key = apiKey;

  const existingSubscription = await Subscription.findOne({ email });

  if (existingSubscription && new Date(existingSubscription.endDate) > new Date()) {
    return res.status(400).json({ error: "Already Subscribed.Come back when it ends" });
  }
  const resultKey = createPaymentHash(reqData);
  return res.json({ data: resultKey });
};

const paymentResponse = async (req, res) => {
  const reqData = req.body;

  console.log("Incoming payment response data:", reqData);

  const shasum = crypto.createHash('sha512');
  let hashData = process.env.OMNIWARE_SALT;

  const keys = Object.keys(reqData).sort();
  keys.forEach(k => {
    if (k !== 'hash' && reqData[k]) {
      hashData += '|' + reqData[k].toString();
    }
  });

  const calculatedHash = shasum.update(hashData).digest('hex').toUpperCase();
  console.log("Calculated Hash for Response:", calculatedHash);

  if (reqData['hash'] === calculatedHash) {
    if (reqData['response_code'] === "0") {
      // Payment success
      const endDate = moment().add(365, 'days').toDate();

      const subscription = new Subscription({
        orderId: reqData['order_id'],
        templeId: reqData['address_line_2'],
        templeName: reqData['name'],
        address: reqData['address_line_1'],
        email: reqData['email'],
        number: reqData['phone'],
        amount: parseFloat(reqData['amount']),
        transactionId: reqData['transaction_id'],
        paymentStatus: 'Paid',
        endDate: endDate
      });

      try {
        await subscription.save();
        console.log("✅ Subscription saved successfully");
        return res.redirect(`${process.env.FRONTEND_URL}/subscription-success`);
      } catch (error) {
        console.error("❌ Error saving subscription:", error);
        // If saving fails, redirect to failure page
        return res.redirect(`${process.env.FRONTEND_URL}/subscription-failed`);
      }
    } else {
      console.error("❌ Payment Failed:", reqData['response_message']);
      return res.redirect(`${process.env.FRONTEND_URL}/subscription-failed`);
    }
  } else {
    console.error("❌ Hash Mismatch!");
    return res.redirect(`${process.env.FRONTEND_URL}/subscription-failed`);
  }
};








//offline payment// 


const createOfflineSubscription = async (req, res) => {
  try {
    const { templeName, templeId, address, email, number } = req.body;

      // Check if the user already has an active subscription
      const existingSubscription = await Subscription.findOne({
        email,
        templeId,
        endDate: { $gt: new Date() }, // Check if there is an active subscription (endDate > current date)
      });
  
      if (existingSubscription) {
        return res.status(400).json({
          message: "You already have an active subscription. Please renew after the current subscription ends.",
        });
      }
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const orderId = `ORD-${Date.now()}`;
    const transactionId = `TXN-${uuidv4()}`;

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
      
    });

    await subscription.save();

    res.status(201).json({ message: "Offline subscription created and marked as Paid", subscription });
  } catch (error) {
    console.error("Subscription creation failed:", error.message);
    res.status(500).json({ message: error.message });
  }
}


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

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    if (!subscriptions.length) {
      return res.status(404).json({ message: 'No subscriptions found' });
    }
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const downloadInvoice = async (req, res) => {
  const { id } = req.params

  try {
    // Use findOneAndUpdate with atomic increment to avoid race conditions
    const subscription = await Subscription.findOneAndUpdate(
      { _id: id },
      { $inc: { invoiceNumber: 1 } }, // Atomically increment by 1
      {
        new: false, // Return the document before update
        upsert: false, // Don't create if doesn't exist
      },
    )

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }

    // Generate invoice number using the OLD value (before increment)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const invoiceNumber = String(subscription.invoiceNumber || 0).padStart(6, "0")
    const invoiceId = `SSD-${year}-${month}/${invoiceNumber}`

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    res.setHeader("Content-disposition", `attachment; filename=invoice_${subscription._id}_${invoiceNumber}.pdf`)
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
      .moveDown(1)

    // Bill To Section
    doc
      .fontSize(10)
      .fillColor("#444")
      .text("Bill To:", 50, doc.y)
      .font("Helvetica-Bold")
      .text(subscription.templeName, { continued: true })
      .font("Helvetica")
      .text(`\n${subscription.address}\n${subscription.number}\n${subscription.email}`)
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
      .text("Subscription Charges", 85, tableStartY + 35, { width: 180, align: "left" })
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

// Alternative approach: Generate unique invoice numbers using timestamp + random
const getInvoiceNumber = async (req, res) => {
  const { id } = req.params

  try {
    const subscription = await Subscription.findById(id)

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }

    // Generate unique invoice number using timestamp and random number
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const timestamp = Date.now().toString().slice(-6) // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")
    const uniqueNumber = `${timestamp}${random}`
    const invoiceId = `SSD-${year}-${month}/${uniqueNumber}`

    // Rest of the PDF generation code remains the same...
    const doc = new PDFDocument({ margin: 50 })
    res.setHeader("Content-disposition", `attachment; filename=invoice_${subscription._id}_${uniqueNumber}.pdf`)
    res.setHeader("Content-type", "application/pdf")

    doc.pipe(res)

    // ... (rest of PDF generation code)

    doc.end()
  } catch (error) {
    console.error("Invoice generation error:", error)
    res.status(500).json({ message: error.message })
  }
}



module.exports = {
  paymentRequest,
  paymentResponse,
  createOfflineSubscription,getSubscriptionByEmail,downloadInvoice,getInvoiceNumber,getAllSubscriptions
}
