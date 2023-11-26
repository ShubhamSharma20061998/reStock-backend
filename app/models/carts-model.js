const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartsSchema = new Schema(
  {
    productID:
      {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
    quantity: {
      type: Number,
      default: 1,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartsSchema);

module.exports = Cart;
