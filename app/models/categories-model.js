const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categoriesSchema = new Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Categories = model("Categories", categoriesSchema);

module.exports = Categories;
