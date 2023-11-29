const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const shopDetailsSchema = new Schema(
  {
    shopName: String,
    ownerFirstName: String,
    ownerLastName: String,
    email: String,
    contact: Number,
    alternateContact: Number,
    shopAddress: [
      {
        fullAddress: String,
        pincode: Number,
        landmark: String,
        shopContact: Number,
      },
    ],
    gstNo: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ShopsDetails = model("ShopDetails", shopDetailsSchema);

module.exports = ShopsDetails;
