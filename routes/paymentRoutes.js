const express = require("express");
const paymentRouter = express.Router();
const paymentControllesr = require("../controller/paymentControllesr");
paymentRouter.post("/create-order", paymentControllesr.createOrder);
paymentRouter.post("/verify-payment", paymentControllesr.verifyPayment);
module.exports = paymentRouter;
