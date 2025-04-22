const Subscription = require("../Models/Subscription");
const crypto = require("crypto");
require("dotenv").config();

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
      hashData += '|' + reqData[entry];
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

  const resultKey = createPaymentHash(reqData);
  return res.json({ data: resultKey });
};

const paymentResponse = async (req, res) => {
  const reqData = req.body;

  const shasum = crypto.createHash('sha512');
  let hashData = SALT;
  let keys = Object.keys(reqData).sort();

  keys.forEach(k => {
    if (k !== 'hash' && reqData[k]) {
      hashData += '|' + reqData[k].toString();
    }
  });

  const calculatedHash = shasum.update(hashData).digest('hex').toUpperCase();

  if (reqData['hash'] === calculatedHash) {
    if (reqData['response_code'] === "0") {
      try {
        const subscription = new Subscription({
          orderId: reqData['order_id'],
          templeId: reqData['temple_id'],              // ✅ Add templeId
          templeName: reqData['temple_name'],
          address: reqData['address'],
          email: reqData['email'],
          number: reqData['phone'],
          amount: parseFloat(reqData['amount']),
          transactionId: reqData['transaction_id'],
          paymentStatus: 'Paid',
        });

        await subscription.save();
        console.log("✅ Subscription saved successfully");

        // Optional: Respond with JSON if you're building an API
        return res.status(201).json({
          message: "Payment Successful",
          subscriptionId: subscription._id,
          transactionId: subscription.transactionId,
        });

        // Or if you're rendering view
        // res.render('success', {
        //   message: reqData['response_message'],
        //   transaction_id: reqData['transaction_id'],
        //   amount: reqData['amount']
        // });

      } catch (err) {
        console.error("❌ Error saving subscription:", err);
        return res.status(500).json({ error: "Subscription save failed" });
      }

    } else {
      console.error("❌ Payment Failed:", reqData['response_message']);
      return res.status(400).json({ message: reqData['response_message'] });
    }
  } else {
    console.error("❌ Hash Mismatch!");
    return res.status(400).json({ message: "Hash mismatch" });
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
  paymentRequest,
  paymentResponse,
  createOfflineSubscription,getSubscriptionByEmail,downloadInvoice,getInvoiceNumber
}
