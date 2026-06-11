const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const {
  getHomeBookings,
  getPureTimestamp,
  dateConvert,
} = require("../utils/getLatestBookingDataUsingHomeId");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  const { homeId, checkOut, checkIn, amount } = req.body;
  const disableRange = await getHomeBookings(homeId);

  const bookinDate = [
    {
      bookingDate: { checkIn: new Date(checkIn), checkOut: new Date(checkOut) },
    },
  ];

  const userWantsBookDate = dateConvert(bookinDate);
  const userFrom = getPureTimestamp(userWantsBookDate[0].from);
  const userTo = getPureTimestamp(userWantsBookDate[0].to);
  const hasConflict = disableRange.some((range) => {
    const bookedFrom = getPureTimestamp(range.from);
    const bookedTo = getPureTimestamp(range.to);
    console.log(userFrom, bookedTo, userTo, bookedFrom);
    return userFrom < bookedTo && userTo > bookedFrom;
  });

  if (!hasConflict) {
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
  } else {
    return res.json({ success: "date not available", refreshPage: true });
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
      //checking booking date are still available
      const bookinDate = [
        {
          bookingDate: {
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
          },
        },
      ];
      const userWantsBookDate = dateConvert(bookinDate);
      const disableRange = (await getHomeBookings(homeId)) ?? [];
      const userFrom = getPureTimestamp(userWantsBookDate[0].from);
      const userTo = getPureTimestamp(userWantsBookDate[0].to);
      const hasConflict = disableRange.some((range) => {
        const bookedFrom = getPureTimestamp(range.from);
        const bookedTo = getPureTimestamp(range.to);
        console.log(userFrom, bookedTo, userTo, bookedFrom);
        return userFrom <= bookedTo && userTo >= bookedFrom;
      });

      const objectUserId = new mongoose.Types.ObjectId(req.session.user.id);
      // Payment is legitimate! Store the transaction documents cleanly inside MongoDB
      const newBooking = new Booking({
        userId: objectUserId, // Tracks who bought it
        homeId: homeId, // Tracks which house was booked
        amount: Number(amount),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "Success",
        boookingStatus: "Panding",
        bookingDate: { checkIn, checkOut },
        nights,
        member: { adults, kids },
      });
      if (!hasConflict) {
        await newBooking.save();
        const response = await Booking.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          { boookingStatus: "Confirm" },
          { new: true },
        );
        return res
          .status(200)
          .json({ success: true, message: "Transaction verified and stored!" });
      } else {
        const conflictBooking = new Booking({
          isConflict: true,
          status: "Refund Needed",
          originalCheckIn: checkIn,
          originalCheckOut: checkOut,
          capturedAmount: Number(amount),
          conflictOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          userId: objectUserId,
          conflictOrderHomeId: homeId,
          boookingStatus: "panding",
        });
        const response = await Booking.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          { boookingStatus: "Cancle Due To Date Not Available" },
          { new: true },
        );
        conflictBooking.save();
        return res
          .status(400)
          .json({ success: false, message: "Booking Date Conflict!" });
      }
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
