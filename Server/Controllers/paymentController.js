const Subscription = require("../Models/Subscription")
const TempleCollection = require('../Models/Temple');
const { v4: uuidv4 } = require('uuid'); 

const axios = require("axios")
const crypto = require("crypto")
const jwt = require("jsonwebtoken");
require("dotenv").config()

// Updated to use HTTPS
const API_URL = process.env.OMNIWARE_API_URL
const API_KEY = process.env.OMNIWARE_API_KEY
const MERCHANT_ID = process.env.OMNIWARE_MERCHANT_ID
const OMNIWARE_SALT = process.env.OMNIWARE_SALT
const FRONTEND_URL = process.env.FRONTEND_URL
const OMNIWARE_PAYMENT_URL = process.env.PAYMENT_URL


console.log("API_URL:", API_URL);
console.log("API_KEY:", API_KEY); 
console.log("MERCHANT_ID:", MERCHANT_ID);
console.log("OMNIWARE_SALT:", OMNIWARE_SALT);
console.log("FRONTEND_URL:", FRONTEND_URL);

// ✅ Throw error if any of them is missing
if (!API_URL) {
  throw new Error("OMNIWARE_API_URL not set");
}
if (!API_KEY) {
  throw new Error("OMNIWARE_API_KEY not set");
}
if (!MERCHANT_ID) {
  throw new Error("OMNIWARE_MERCHANT_ID not set");
}
if (!OMNIWARE_SALT) {
  throw new Error("OMNIWARE_SALT not set");
}
if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL not set");
}

// Generate Checksum with logging
const generateChecksum = (orderId, amount, redirectUrl) => {
  // Ensure amount is a string with 2 decimal places
  const formattedAmount = typeof amount === 'string' ? amount : parseFloat(amount).toFixed(2);
  
  // Create the signature string exactly as Omniware expects
  const signatureString = `${MERCHANT_ID}|${orderId}|${formattedAmount}|INR|${redirectUrl}|${OMNIWARE_SALT}`;
  console.log("Checksum generation:");
  console.log("- Merchant ID:", MERCHANT_ID);
  console.log("- Order ID:", orderId);
  console.log("- Amount:", formattedAmount);
  console.log("- Currency:", "INR");
  console.log("- Redirect URL:", redirectUrl);
  console.log("- Salt (first 4 chars):", OMNIWARE_SALT.substring(0, 4) + "...");
  console.log("- Signature string:", signatureString);
  
  const checksum = crypto.createHash("sha256").update(signatureString).digest("hex");
  console.log("- Generated checksum:", checksum);
  
  return checksum;
};

// Generate Signature for Verification
const generateSignature = (payload) => {
  const dataString = JSON.stringify(payload);
  return crypto.createHmac("sha256", OMNIWARE_SALT).update(dataString).digest("hex");
};

// Create Subscription and Return Payment Form
const createonlineSubscription = async (req, res) => {
  try {
    console.log("Starting createonlineSubscription");
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const email = decoded.email;
    console.log("User email:", email);
    
    const temple = await TempleCollection.findOne({ email });
    console.log("Temple found:", temple ? "Yes" : "No");

    if (!temple) return res.status(404).json({ message: "Temple not found" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 12);

    // Generate unique order ID with timestamp (no hyphens or special characters)
    const orderId = `ORD${Date.now()}`;
    const transactionId = `TXN${Date.now()}`;
    console.log("Generated order ID:", orderId);
    console.log("Generated transaction ID:", transactionId);

    const lastSub = await Subscription.findOne().sort({ invoiceNumber: -1 });
    const invoiceNumber = lastSub ? lastSub.invoiceNumber + 1 : 1;
    console.log("Invoice number:", invoiceNumber);

    // Use fixed values for testing if temple values are not available
    const amount = temple.amount || 1000;
    const gst = temple.gst || 180;
    const totalAmount = temple.totalAmount || 1180;
    console.log("Amount:", amount);
    console.log("GST:", gst);
    console.log("Total amount:", totalAmount);

    const subscription = new Subscription({
      orderId,
      transactionId,
      templeName: temple.name,
      templeId: temple._id,
      address: temple.address,
      email: temple.email,
      number: temple.phone,
      startDate,
      endDate,
      amount,
      gst,
      totalAmount,
      invoiceNumber,
      paymentStatus: "Pending",
    });

    await subscription.save();
    console.log("Subscription saved to database");

    // Format amount with 2 decimal places as a string
    const formattedAmount = totalAmount.toFixed(2);
    const redirectUrl = `${FRONTEND_URL}/payment-success`;
    const cancelUrl = `${FRONTEND_URL}/payment-failed`;
    const checksum = generateChecksum(orderId, formattedAmount, redirectUrl);

    console.log("Payment request details:");
    console.log("- Payment URL:", OMNIWARE_PAYMENT_URL);
    console.log("- Redirect URL:", redirectUrl);
    console.log("- Cancel URL:", cancelUrl);

    // Return form data to frontend with all required parameters
    const paymentPayload = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      transaction_id: transactionId,
      amount: formattedAmount,
      currency: "INR",
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      customer_mobile: temple.phone,
      customer_name: temple.name,
      checksum
    };
    
    console.log("Payment payload:", JSON.stringify(paymentPayload, null, 2));
    
    return res.status(200).json({
      paymentUrl: OMNIWARE_PAYMENT_URL,
      paymentPayload
    });

  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Verify payment after Omniware redirection
const verifyPayment = async (req, res) => {
  try {
    console.log("Verify payment request received");
    console.log("Request body:", req.body);
    console.log("Request query:", req.query);
    
    // Extract parameters from query string or body
    const transactionId = req.query.transaction_id || req.body.transactionId;
    const orderId = req.query.order_id || req.body.orderId;
    const status = req.query.status || req.body.status;

    console.log("Payment verification parameters:");
    console.log("- Transaction ID:", transactionId);
    console.log("- Order ID:", orderId);
    console.log("- Status:", status);

    if (!transactionId || !orderId) {
      return res.status(400).json({ success: false, message: "Missing transactionId or orderId" });
    }

    const subscription = await Subscription.findOne({ orderId });
    console.log("Subscription found:", subscription ? "Yes" : "No");
    
    if (!subscription) return res.status(404).json({ success: false, message: "Subscription not found" });

    // If status is already provided in the callback, use it
    if (status === "success") {
      subscription.paymentStatus = "Paid";
      subscription.transactionId = transactionId;
      await subscription.save();
      console.log("Payment marked as successful based on callback status");

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
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
      });
    }

    // Otherwise, verify with Omniware API
    const payload = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      transaction_id: transactionId,
    };

    const signature = generateSignature(payload);
    console.log("Verification API request:");
    console.log("- Payload:", JSON.stringify(payload));
    console.log("- Signature:", signature);

    console.log("Making verification API call to:", `${API_URL}/verify-payment`);
    const response = await axios.post(`${API_URL}/verify-payment`, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "x-signature": signature,
      },
    });

    console.log("Verification API response:", response.data);

    if (response.data.status === "success") {
      subscription.paymentStatus = "Paid";
      subscription.transactionId = transactionId;
      await subscription.save();
      console.log("Payment marked as successful based on API verification");

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
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
      });
    } else {
      subscription.paymentStatus = "Failed";
      await subscription.save();
      console.log("Payment marked as failed based on API verification");

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        details: response.data,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};





//offline payment// 


const createOfflineSubscription = async (req, res) => {
  try {
    const { templeName, templeId, address, email, number } = req.body;

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
  //  .text(`Due Date: ${new Date(subscription.endDate).toDateString()}`, { align: "right" })
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
  createonlineSubscription,
  verifyPayment,
  createOfflineSubscription,getSubscriptionByEmail,downloadInvoice,getInvoiceNumber
}

