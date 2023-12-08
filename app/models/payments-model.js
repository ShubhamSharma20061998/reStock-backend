const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
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
    invoiceID: String,
    invoice_url: String,
    email: String,
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);

module.exports = Payment;
