const { Schema, model } = require("mongoose")

const TempleAcharyasroleSchema = new Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });


const TempleAcharyasroleCollection = model('TempleAcharyasroleSchema', TempleAcharyasroleSchema)

module.exports =  TempleAcharyasroleCollection