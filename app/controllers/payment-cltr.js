const { validationResult } = require("express-validator");
const _ = require("lodash");
const Payment = require("../models/payments-model");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const paymentCltr = {};

paymentCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, ["lineItems", "quantity", "totalAmount"]);
  try {
    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.lineItems.map(item => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
              metadata: {
                products: item.products,
              },
            },
            unit_amount: Math.floor(item.price * 100),
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:3000/cart",
      cancel_url: "http://localhost:5173/*",
      client_reference_id: req.user.id,
    });
    const payment = new Payment(body);
    payment.totalAmount = body.totalAmount;
    payment.method = "card";
    payment.transactionID = session.id;
    payment.userID = req.user.id;
    await payment.save();
    res.json({ url: session.url, payment });
  } catch (err) {
    console.log(err);
    // res.status(500).json(err);
  }
};

module.exports = paymentCltr;
