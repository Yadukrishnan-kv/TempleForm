const {Schema,model}=require("mongoose")
const ContactUsSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    comments: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },{timestamps:true});
  const ContactUs =model('ContactUs', ContactUsSchema);

module.exports = ContactUs;