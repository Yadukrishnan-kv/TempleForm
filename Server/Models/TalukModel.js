const { Schema, model } = require("mongoose");

const talukSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  district: {
    type: Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
  state: {
    type: Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  }
}, { timestamps: true });

const Taluk = model('Taluk', talukSchema);

module.exports = Taluk;

