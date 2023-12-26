const { validationResult } = require("express-validator");
const _ = require("lodash");
const Payment = require("../models/payments-model");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { transporter } = require("../../utils/backend-utils");

const paymentCltr = {};

/**
 * Creates a nodemailer transporter object with the specified configuration.
 * @param {Object} config - The configuration object for the transporter.
 * @param {string} config.service - The email service to use (e.g. "gmail").
 * @param {Object} config.auth - The authentication credentials for the email service.
 * @param {string} config.auth.user - The email address or username.
 * @param {string} config.auth.pass - The password or access token.
 * @returns None
 */
transporter.verify((err, success) => {
  //check for initialisation status
  if (err) {
    console.log("Nodemailer initialisation error : ", err);
  } else {
    console.log("Nodemailer : ", success, "ready for messages");
  }
});

paymentCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, ["lineItems", "totalAmount", "email"]);
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
            unit_amount: Math.floor(Number(item.price) * 100),
          },
          quantity: item.quantity,
        };
      }),
      success_url: "https://restock-shubham.netlify.app/?success=true",
      cancel_url: "https://restock-shubham.netlify.app/?cancel=true",
      client_reference_id: req.user.id,
    });
    const payment = new Payment(body);
    payment.totalAmount = body.totalAmount;
    payment.method = "card";
    payment.transactionID = session.id;
    payment.userID = req.user.id;
    payment.paymentStatus = "pending";
    await payment.save();
    if (body.email) {
      const info = await transporter.sendMail({
        from: `Shubham Sharma ${process.env.EMAIL_ID}`, // sender address
        to: `${body.email}`, // list of receivers
        subject: "Order Recieved", // Subject line
        text: "We have recieved your order.Thanks! for being a part of reStock.", // plain text body
        html: "<b>We have recieved your order.Thanks! for being a part of reStock.</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
    }
    res.json({
      url: session.url,
      id: session.id,
      status: payment.status,
    });
  } catch (err) {
    console.log(err);
    // res.status(500).json(err);
  }
};

paymentCltr.update = async (req, res) => {
  const { id } = req.params;
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionID: id },
      { paymentStatus: "success" },
      { new: true }
    );
    res.json(updatePayment);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

paymentCltr.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPayment = await Payment.findOneAndDelete({
      transactionID: id,
    });
    res.json(deletedPayment);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

paymentCltr.list = async (req, res) => {
  try {
    const paymentList = await Payment.find({
      paymentStatus: "pending",
    });
    res.json(paymentList);
  } catch (error) {
    res.status(500).json({ errors: [{ msg: error.message }] });
  }
};

module.exports = paymentCltr;
