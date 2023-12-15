const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    orderDate: String,
    orderOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lineItems: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: Number,
        amount: Number,
      },
    ],
    status: {
      type: String,
      enum: ["not processed", "accepted", "shipped", "delivered", "cancel"],
      default: "not processed",
    },
    // shopID: Schema.Types.ObjectId,
    expectedDeliverDate: Date,
    // complaints: {
    //   note: String,
    //   images: [{ image: String }],
    // },
  },
  { timestamps: true }
);

const Orders = model("Orders", orderSchema);

module.exports = Orders;
