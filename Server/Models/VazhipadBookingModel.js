const { Schema, model } = require("mongoose")

const vazhipadBookingSchema = new Schema(
  {
    temple: {
      type: Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    vazhipads: [
      {
        vazhipad: {
          type: Schema.Types.ObjectId,
          ref: "Vazhipad",
          required: true,
        },
        vazhipadName: {
          type: String,
          required: true,
        },
        entries: [
          {
            name: {
              type: String,
              required: true,
            },
            birthNakshatra: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
)

const VazhipadBookingCollection = model("VazhipadBooking", vazhipadBookingSchema)

module.exports = VazhipadBookingCollection

