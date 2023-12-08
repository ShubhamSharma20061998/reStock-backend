const { validationResult } = require("express-validator");
const _ = require("lodash");
const Products = require("../models/products-model");
const uploadToS3 = require("../middlewares/aws");

const productCtrl = {};

productCtrl.getAllProducts = async (req, res) => {
  const { condition } = req.query;
  try {
    if (condition == "a-z") {
      const products = await Products.aggregate([{ $sort: { title: 1 } }]);
      return res.json(products);
    } else if (condition == "z-a") {
      const products = await Products.aggregate([
        {
          $sort: {
            title: -1,
          },
        },
      ]);
      return res.json(products);
    } else if (condition == "lowest-highest") {
      const products = await Products.aggregate([
        {
          $sort: {
            price: 1,
          },
        },
      ]);
      return res.json(products);
    } else if (condition == "highest-lowest") {
      const products = await Products.aggregate([
        {
          $sort: {
            price: -1,
          },
        },
      ]);
      return res.json(products);
    }
    const products = await Products.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ errors: "something went wrong" });
  }
};

productCtrl.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "brandName",
    "isNewProducts",
    "productReleaseDate",
    "unitType",
    "stocks",
    "title",
    "images",
    "price",
    "description",
    "rating",
    "category",
    "maxOrderUnit",
    "minOrderUnit",
  ]);
  const product = new Products(body);
  const files = req.files;
  product.slug = body.title.split(" ").join("-") || body.title;
  try {
    const existingProduct = await Products.findOne({
      title: body.title,
      price: body.price,
      category: body.category,
    });
    if (existingProduct) {
      return res.json({ errors: [{ msg: "product already exists" }] });
    }
    for (const file of files) {
      const uploadResult = await uploadToS3(file, req.user.id);
      product.images.push(uploadResult);
    }
    if (req.user.role == "admin") {
      await product.save();
      res.json({ message: "product added successfully", product });
    } else {
      res.json({ errors: "access denied" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

productCtrl.removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role == "admin") {
      const product = await Products.findOneAndDelete({ _id: id });
      if (!product) {
        return res.status(404).json({ error: "product not found" });
      }
      res.json({
        message: "product removed successfully",
        product,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

productCtrl.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const body = _.pick(req.body, [
    "brandName",
    "isNewProducts",
    "productReleaseDate",
    "unitType",
    "stocks",
    "title",
    "images",
    "price",
    "description",
    "rating",
    "category",
    "maxOrderUnit",
    "minOrderUnit",
  ]);
  try {
    const product = await Products.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
    res.json({
      message: "product updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = productCtrl;
