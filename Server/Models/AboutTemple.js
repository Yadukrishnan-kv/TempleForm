const { Schema, model } = require("mongoose");
const AboutTempleSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps:true});
const AboutTempleSchemaCollection=model('AboutTemple',AboutTempleSchema)
module.exports=AboutTempleSchemaCollection