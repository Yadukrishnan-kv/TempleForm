const { Schema, model } = require("mongoose");

const selectedLsgSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lsg: {
  type: Schema.Types.String,
}
,
  Taluk: {
    type: Schema.Types.String,
    required: true,
  }
}, { timestamps: true });

const selectedLsg = model('selectedLsg', selectedLsgSchema);

module.exports = selectedLsg;
