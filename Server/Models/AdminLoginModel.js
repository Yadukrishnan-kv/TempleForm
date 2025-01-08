const { Schema, model } = require("mongoose")
const validator = require("validator")

const Adminschema = new Schema({
    name: {
        type: String,
        required: true
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
        enum: ['admin', 'subadmin1', 'subadmin2', 'subadmin3', 'subadmin4', 'subadmin5'],
        default: 'admin'
    },
    menuPermissions: {
        dashboard: { type: Boolean, default: true },
        users: { type: Boolean, default: false },
        registration: { type: Boolean, default: false },
        master: { type: Boolean, default: false },
        blogPage: { type: Boolean, default: false },
        enquiry: { type: Boolean, default: false },
        bookings: { type: Boolean, default: false }
    }
}, { timestamps: true })

const AdminCollection = model('Admin', Adminschema)
module.exports = AdminCollection

