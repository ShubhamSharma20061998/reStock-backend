const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    orderDate: new Date(),
    orderOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lineItems: [
      {
        items: Schema.Types.ObjectId,
        quantity: Number,
        amount: Number,
      },
    ],
    status: [
      {
        title: {
          type: String,
          enum: [
            "not processed",
            "processing",
            "shipped",
            "delivered",
            "cancel",
          ],
        },
      },
    ],
    shopID: Schema.Types.ObjectId,
    expectedDeliverDate: Date,
    complaints: {
      note: String,
      images: [{ image: String }],
    },
  },
  { timestamps: true }
);

const Orders = model("Orders", orderSchema);

module.exports = Orders;
