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
phone: { type: String, unique: true, sparse: true },
 state: { type: String, required: true },
  district: { type: String, required: true },
  taluk: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'subadmin1', 'subadmin2', 'subadmin3', 'subadmin4', 'subadmin5'],
        default: 'admin'
    },
    menuPermissions: {
        dashboard: { type: Boolean, default: true },
        users: { type: Boolean, default: false },
        registration: { type: Boolean, default: false },
        log: { type: Boolean, default: false },
        master: { type: Boolean, default: false },
        blogPage: { type: Boolean, default: false },
        enquiry: { type: Boolean, default: false },
        bookings: { type: Boolean, default: false }
    }
}, { timestamps: true })
const AdminLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['Login', 'Failed Login', 'Menu Click', 'Logout', 'Create', 'Update', 'Delete', 'View'] 
    },
    module: {
        type: String,
        required: true
    },
    subModule: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    }
}, { timestamps: true })

const AdminCollection = model('Admin', Adminschema)
const AdminLogCollection = model('AdminLog', AdminLogSchema)

module.exports = { AdminCollection, AdminLogCollection }


