const { Schema, model } = require("mongoose");

const selectedLsgSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lsg: {
  type: Schema.Types.ObjectId,
  ref: 'lsg'
}
,
  Taluk: {
    type: Schema.Types.ObjectId,
    ref: 'Taluk',
    required: true,
  }
}, { timestamps: true });

const selectedLsg = model('selectedLsg', selectedLsgSchema);

module.exports = selectedLsg;
