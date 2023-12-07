const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const paymentSchema = {
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  totalAmount: Number,
  method: String,
  orderStatus: String,
  transactionID: String,
  lineItems: [
    {
      products: { type: Schema.Types.ObjectId, ref: "Products" },
      quantity: Number,
    },
  ],
  paymentStatus: String,
};

const Payment = model("Payment", paymentSchema);

module.exports = Payment;
