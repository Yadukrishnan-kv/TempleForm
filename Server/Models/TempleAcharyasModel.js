const { Schema, model } = require("mongoose")


const TempleAcharyasSchema = new Schema({
  image: {
    filename: String,
    originalname: String,
    path: String
},
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  role: { type: String, required: true }

   
}, { timestamps: true })


const TempleAcharyasCollection = model('TempleAcharyasSchema', TempleAcharyasSchema)

module.exports =  TempleAcharyasCollection