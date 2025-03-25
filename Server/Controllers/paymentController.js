const Subscription = require("../Models/Subscription")
const axios = require("axios")
const crypto = require("crypto")
const PDFDocument = require("pdfkit")

// const fs = require("fs")
const pdf = require('html-pdf');
// const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
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
  const { id } = req.params;

  try {
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Read the logo file and convert to base64 (if needed)
    const logoPath = path.join(__dirname, "../assets/images/logo.png");
    let logoBase64 = "";
    try {
      const logoData = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;
    } catch (err) {
      console.error("Error reading logo file:", err);
      // If logo can't be read, continue without it
    }

    // Generate invoice number dynamically
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    const invoiceNumber = String(subscription.invoiceNumber || 0).padStart(6, "0");
    const nextInvoiceNumber = parseInt(invoiceNumber) + 1;
    subscription.invoiceNumber = nextInvoiceNumber;
    await subscription.save();

    const invoiceId = `SSD-${year}-${month}/${invoiceNumber}`;

    // Create invoice HTML content (same as before)
    const invoiceHtml = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        
        body {
            font-family: 'Roboto', sans-serif;
        }
        p {
            margin: 7px 0;
            color: #444;
        }
        .amount-section p {
            color: #000;
        }
        .invoice-container {
            background: #fff;
            padding: 40px 30px;
            max-width: 800px;
            margin: auto;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .invoiceheader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h2 {
            margin: 0 0 20px 0;
            color: #000;
        }
        .invoice-title .status_red {
            font-weight: bold;
            color: red;
        }
        .invoice-title .status_green {
            font-weight: bold;
            color: green;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        .table th, .table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .table th {
            background: #4d628c;
            color: #fff;
            font-weight: 500;
        }
        .amount-section {
            text-align: right;
            margin-top: 60px;
        }
        .amount-section p {
            padding-right: 30px;
        }
        .bggrey {
            background: #eee;
            margin: 0;
            padding: 8px 30px;
            border-radius: 5px;
        }
        .button_outer {
            padding: 40px 30px;
            max-width: 800px;
            margin: auto;
            display: flex;
            justify-content: end;
        }
        .button_outer a {
            color: #fff;
            background: #333;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 10px;
            margin-left: 15px;
            font-weight: 500;
        }
        .button_outer a:hover {
            background: #555;
        }
        .invoice-title1 {
            margin-top: -120px;
        }
        .invoice-title2 {
            margin-top: -80px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoiceheader">
            <div class="invoice-title">
                <h2>INVOICE</h2>
                <p># ${invoiceId}</p>
                <p class="status_green">PAID</p>
            </div>
            <div class="invoice-title1">
                <h3>SREESHUDDHI</h3>
                <p>Kalady, Kerala, India - 683574</p>
                <p>Phone: +91 98470 47963</p>
            </div>
        </div>
        <div class="invoiceheader">
            <div class="invoice-title">
                <p><strong>Invoice Date:</strong> ${new Date(subscription.startDate).toDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(subscription.endDate).toDateString()}</p>
            </div>
            <div class="invoice-title2">
                <h4>Bill To:</h4>
                <p>${subscription.templeName}</p>
                <p>${subscription.address}</p>
                <p>${subscription.number}</p>
                <p>${subscription.email}</p>
            </div>
        </div>
        <table class="table">
            <tr>
                <th>#</th>
                <th>Description</th>
                <th>Amount</th>
                <th>GST (18%)</th>
                <th>Total Amount</th>
            </tr>
            <tr>
                <td>1</td>
                <td><strong>Subscription Charges</strong></td>
                <td>₹1000.00</td>
                <td>₹180.00</td>
                <td>₹${subscription.totalAmount}</td>
            </tr>
        </table>
        <div class="amount-section">
            <p class="bggrey"><strong>Total Amount:</strong> ₹${subscription.totalAmount}</p>
        </div>
    </div>
</body>
</html>
    `;

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some production environments
    });
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(invoiceHtml, { waitUntil: 'networkidle0' });

    // Define PDF options
    const pdfOptions = {
      format: 'A4',
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
      printBackground: true, // Ensures background colors and styles are included
    };

    // Generate PDF as a buffer
    const pdfBuffer = await page.pdf(pdfOptions);

    // Close the browser
    await browser.close();

    // Set response headers and send the PDF
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${subscription._id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};

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

