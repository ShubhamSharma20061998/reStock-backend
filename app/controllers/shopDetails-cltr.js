require("dotenv").config();
const { validationResult } = require("express-validator");
const _ = require("lodash");
const nodemailer = require("nodemailer");
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

const transporter = nodemailer.createTransport({
  //Initialise nodemailer
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.G_PASS,
  },
});

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
    // const registerShop = await ShopsDetails.findOne({
    //   shopName: body.shopName,
    // });
    // if (registerShop) {
    //   return res.status(400).json({ errors: "shop already exists" });
    // }
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
