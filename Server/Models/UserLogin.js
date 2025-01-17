const { Schema, model } = require("mongoose")
const validator = require("validator")

const Userschema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
      },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: validator.isEmail
    },
     password: {
        type: String,
        required: true
      },
    role: {
        type: String,
        default: '1'
    },
   
}, { timestamps: true })


const UserCollection = model('Users', Userschema)

module.exports =  UserCollection