const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_booking_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate payment" });
  }
};
exports.verifyPayment = async (req, res) => {
  const {
    checkIn,
    checkOut,
    nights,
    amount,
    adults,
    kids,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    homeId,
  } = req.body;

  // 💡 Security Check: Verify that the signature matches your Secret Key
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    try {
      const objectUserId = new mongoose.Types.ObjectId(req.session.user.id);
      // Payment is legitimate! Store the transaction documents cleanly inside MongoDB
      const newBooking = new Booking({
        userId: objectUserId, // Tracks who bought it
        homeId: homeId, // Tracks which house was booked
        amount: Number(amount),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "Success",
        bookingDate: { checkIn, checkOut },
        nights,
        member: { adults, kids },
      });

      await newBooking.save();
      res
        .status(200)
        .json({ success: true, message: "Transaction verified and stored!" });
    } catch (err) {
      console.log(err, "err while saving transaction");
      res
        .status(500)
        .json({ success: false, message: "Database storage failure" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Invalid payment signature match!" });
  }
};
