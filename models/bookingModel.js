const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
    amount: Number,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paymentStatus: { type: String, default: "Pending" },
    bookingDate: { checkIn: { type: Date }, checkOut: { type: Date } },
    nights: { type: Number },
    member: {
      adults: String,
      kids: String,
    },
    boookingStatus: { type: String, default: "Panding" },

    //seprate conflict handling for better admin use and easy to refund
    conflict: {
      isConflict: { type: Boolean, default: false },
      status: {
        type: String,
        enum: [null, "Refund Needed", "Refund Processed"],
      },
      originalCheckIn: Date,
      originalCheckOut: Date,
      capturedAmount: Number,
      conflictOrderId: String,

      razorpayPaymentId: String,
      loggedAt: { type: Date, default: Date.now },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      conflictOrderHomeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
