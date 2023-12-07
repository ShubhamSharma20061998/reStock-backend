const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartsSchema = new Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartsSchema);

module.exports = Cart;
