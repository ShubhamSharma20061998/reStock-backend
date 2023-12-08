/**
 * Controller for managing shop details.
 * @module shopDetailsCltr
 */
require("dotenv").config();
const { validationResult } = require("express-validator");
const _ = require("lodash");
const ShopsDetails = require("../models/shopsDetails-model");
const { transporter } = require("../../utils/backend-utils");

const shopDetailsCltr = {};

/**
 * Retrieves all shop details from the database and sends them as a JSON response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns None
 * @throws {Error} If there is an error retrieving the shop details from the database.
 */
shopDetailsCltr.getAllShops = async (req, res) => {
  try {
    const shops = await ShopsDetails.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json(err);
  }
};

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

shopDetailsCltr.createAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "shopName",
    "ownerFirstName",
    "ownerLastName",
    "email",
    "contact",
    "alternateContact",
    "shopAddress",
    "fullAddress",
    "pincode",
    "landmark",
    "shopContact",
    "gstNo",
    "owner",
  ]);
  try {
    const registerShop = await ShopsDetails.findOne({
      shopName: body.shopName,
    });
    if (registerShop) {
      return res.status(400).json({ errors: [{ msg: "shop already exists" }] });
    }
    const newShop = new ShopsDetails(body);
    await newShop.save();
    if (body.email) {
      const info = await transporter.sendMail({
        from: `Shubham Sharma ${process.env.EMAIL_ID}`, // sender address
        to: `${body.email}`, // list of receivers
        subject: "Registered Successfully", // Subject line
        text: "You have been onboarded on the online platform of reStock", // plain text body
        html: "<b>You have been onboarded on the online platform of reStock.</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
    }
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
