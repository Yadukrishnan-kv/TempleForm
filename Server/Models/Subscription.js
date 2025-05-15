const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    templeId: {
      type: Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    templeName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    amount: { type: Number, default: 1000 },
    gst: { type: Number, default: 180 },
    totalAmount: { type: Number, default:1180},
    transactionId: { type: String, default: null },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    invoiceNumber: { type: Number, unique: true, default: 0 }, 
  },
  { timestamps: true }
);

// ✅ Combined pre-save hook
subscriptionSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Auto-increment invoiceNumber for new documents
    const lastSubscription = await this.constructor.findOne({}, {}, { sort: { invoiceNumber: -1 } });
    this.invoiceNumber = lastSubscription ? lastSubscription.invoiceNumber + 1 : 1;

    // Set endDate to 1 year from startDate
    const startDate = new Date(this.startDate);
    this.endDate = new Date(startDate);
    this.endDate.setFullYear(startDate.getFullYear() + 1);
  }

  // If the startDate is modified, update the endDate
  if (this.isModified("startDate")) {
    const startDate = new Date(this.startDate);
    this.endDate = new Date(startDate);
    this.endDate.setFullYear(startDate.getFullYear() + 1);
  }

  next();
});

// ✅ Export the model
const SubscriptionCollection = model("Subscription", subscriptionSchema);
module.exports = SubscriptionCollection;



