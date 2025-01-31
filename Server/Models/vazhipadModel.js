const { Schema, model } = require("mongoose")

const vazhipadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    temple: {
      type: Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    templeName: {
      type: String,
      required: true,
    },
    templeEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const VazhipadCollection = model("Vazhipad", vazhipadSchema)

module.exports = VazhipadCollection

