const { validationResult } = require("express-validator");
const Cart = require("../models/carts-model");
const _ = require("lodash");

const cartCltr = {};

cartCltr.getAllItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userID: req.user.id })
      .populate("productID")
      .populate("userID");
    res.json({ message: "Added to cart", cartItems });
  } catch (err) {
    res.status(500).json(err);
  }
};

cartCltr.createItems = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const body = _.pick(req.body, ["quantity"]);
  try {
    const cartItem = await Cart.findOne({ productID: id });
    if (cartItem) {
      const cart = await Cart.findOneAndUpdate(
        { productID: id },
        { $inc: { quantity: 1 } },
        { new: true }
      );
      return res.json({
        message: "Added to cart",
        cart,
      });
    }
    const cart = new Cart(body);
    cart.productID = id;
    cart.userID = req.user.id;
    await cart.save();
    res.json({
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

cartCltr.removeItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Cart.findOneAndDelete({ _id: id });
    res.json(item);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

cartCltr.increaseQuantity = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Cart.findOneAndUpdate(
      { _id: id },
      { $inc: { quantity: 1 } },
      { new: true }
    );
    res.json(response);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
    // res.status(500).json(err.response.data.errors);
  }
};

cartCltr.decreaseQuantity = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Cart.findByIdAndUpdate(
      id,
      { $inc: { quantity: -1 } },
      { new: true }
    );
    res.json(response);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

cartCltr.removeMultipleItems = async (req, res) => {
  const body = _.pick(req.body, ["ids"]);
  const { ids } = body; // send array of objectIds
  try {
    const result = await Cart.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} item(s) deleted` });
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

module.exports = cartCltr;
