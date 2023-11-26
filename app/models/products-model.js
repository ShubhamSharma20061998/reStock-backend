const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    brandName: String,
    isNewProducts: {
      type: Boolean,
      default: false,
    },
    productReleaseDate: {
      type: Date,
      default: null,
    },
    unitType: String,
    stocks: Number,
    title: String,
    images: [{ url: String }],
    price: Number,
    description: String,
    rating: Number,
    category: Schema.Types.ObjectId,
    maxOrderUnit: Number,
    minOrderUnit: Number,
    slug: String,
  },
  { timestamps: true }
);

const Products = model("Products", productSchema);

module.exports = Products;
