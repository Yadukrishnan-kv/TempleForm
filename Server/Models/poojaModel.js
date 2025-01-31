const { Schema, model } = require("mongoose")

const poojaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    temple: {
      type: Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
  },
  { timestamps: true },
)

const PoojaCollection = model("Pooja", poojaSchema)

module.exports = PoojaCollection

