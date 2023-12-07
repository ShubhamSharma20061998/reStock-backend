const { validationResult } = require("express-validator");
const _ = require("lodash");
const Orders = require("../models/orders-model");

const ordercltr = {};

ordercltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "orderDate",
    "orderOwner",
    "lineItems",
    "status",
    "shopID",
    "expectedDeliverDate",
    "complaints",
  ]);
  try {
    const order = new Orders(body);
      
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = ordercltr;
