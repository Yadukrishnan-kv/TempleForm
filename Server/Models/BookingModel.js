const {Schema,model}=require("mongoose")
const BookingSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },{timestamps:true});
  const Booking =model('Booking', BookingSchema);

module.exports = Booking;