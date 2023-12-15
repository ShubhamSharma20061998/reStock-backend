const { validationResult } = require("express-validator");
const _ = require("lodash");
const Orders = require("../models/orders-model");

const ordercltr = {};

ordercltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, ["orderOwner", "lineItems", "orderDate"]);
  try {
    const order = new Orders(body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

ordercltr.update = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const order = await Orders.findOneAndUpdate(
      { _id: id },
      { status: "accepted" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

ordercltr.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findOneAndDelete({ _id: id });
    res.json(order);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

ordercltr.list = async (req, res) => {
  try {
    const order = await Orders.find();
    res.json(order);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

ordercltr.getUserOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Orders.find({ orderOwner: id }).populate(
      "lineItems.item"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

ordercltr.listOwnerOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ status: "not processed" }).populate(
      "lineItems.item"
    );
    res.json(orders);
  } catch (err) {
    res.status(400).json({ errors: [{ msg: err.message }] });
  }
};

module.exports = ordercltr;
