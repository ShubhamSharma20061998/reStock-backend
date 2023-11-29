const Categories = require("../models/categories-model");

const categoryCltr = {};

categoryCltr.getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = categoryCltr;
