const { Schema, model } = require("mongoose")

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });


const roleSchemaCollection = model('roleSchema', roleSchema)

module.exports =  roleSchemaCollection