const { validationResult } = require("express-validator");
const _ = require("lodash");
const ShopsDetails = require("../models/shopsDetails-model");

const shopDetailsCltr = {};

shopDetailsCltr.getAllShops = async (req, res) => {
  try {
    const shops = await ShopsDetails.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json(err);
  }
};

shopDetailsCltr.createAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "shopName",
    "ownerFirstName",
    "ownerLastName",
    "contact",
    "alternateContact",
    "shopAddress",
    "gstNo",
    "owner",
  ]);
  try {
    const registerShop = await ShopsDetails.findOne({
      shopName: body.shopName,
    });
    if (registerShop) {
      return res.status(400).json({ errors: "shop already exists" });
    }
    const newShop = new ShopsDetails(body);
    await newShop.save();
    res.json({ message: "shop registered successfully", newShop });
  } catch (err) {
    res.status(500).json(err);
  }
};

shopDetailsCltr.updateShopDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const body = _.pick(req.body, [
    "shopName",
    "ownerFirstName",
    "ownerLastName",
    "contact",
    "alternateContact",
    "shopAddress",
    "gstNo",
    "owner",
  ]);
  try {
    const updateShop = await ShopsDetails.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!updateShop) {
      return res.status(400).json({ errors: "shop not found" });
    }
    res.json({ message: "shop updated successfully", updateShop });
  } catch (err) {
    res.status(500).json(err);
  }
};

shopDetailsCltr.removeShop = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    if (req.user.role == "admin") {
      const removeShop = await ShopsDetails.findOneAndDelete({ _id: id });
      if (!removeShop) {
        return res.status(404).json({ errors: "shop not found" });
      }
      res.json({ message: "shop removed successfully", removeShop });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = shopDetailsCltr;
