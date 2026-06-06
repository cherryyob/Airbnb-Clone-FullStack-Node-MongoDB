const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  homeId: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
  amount: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  paymentStatus: { type: String, default: "Pending" },
  bookingDate: { checkIn: { type: Date }, checkOut: { type: Date } },
  nights: { type: Number },
  member: {
    adults: { type: String, required: true },
    kids: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
