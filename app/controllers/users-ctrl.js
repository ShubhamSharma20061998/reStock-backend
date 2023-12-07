const { validationResult } = require("express-validator");
const _ = require("lodash");
const User = require("../models/users-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ShopsDetails = require("../models/shopsDetails-model");

const userCtrl = {};

// register-ctrl
userCtrl.register = async (req, res) => {
  // check validation [express-validator]
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // body sanitization [lodash]
  const body = _.pick(req.body, ["username", "email", "password"]);
  try {
    const user = new User(body);
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(user.password, salt);
    user.password = hashedPassword;
    const totalUser = await User.countDocuments();
    if (totalUser == 0) {
      user.role = "admin";
    }
    await user.save();
    res.json({
      message: "User register successfully",
      user,
    });
  } catch (err) {
    res.json(err);
  }
};

// login-ctrl
userCtrl.login = async (req, res) => {
  // check validation [express-validator]
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // body sanitization [lodash]
  const body = _.pick(req.body, ["usernameOrEmail", "password"]);
  try {
    const user = await User.findOne({
      $or: [
        { email: body.usernameOrEmail },
        { username: body.usernameOrEmail },
      ],
    });
    if (!user) {
      res
        .status(404)
        .json({ errors: [{ msg: "invalid username / email or password" }] });
    }
    const result = await bcryptjs.compare(body.password, user.password);
    if (!result) {
      return res
        .status(404)
        .json({ errors: [{ msg: "invalid username / email or password" }] });
    }
    const tokenData = { id: user._id, role: user.role };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: `${user.username} Log-In successful`,
      token: `Bearer ${token}`,
      user,
    });
  } catch (err) {
    res.json(err);
  }
};

userCtrl.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, ["username", "email"]);
  const { id } = req.params;
  try {
    if (req.user.id == id || req.user.role == "admin") {
      const user = await User.findOne({ _id: id }, body, { new: true });
      res.json({ message: "user updated successfully", user });
    } else {
      res.status(403).json({ error: "access denied" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

userCtrl.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role == "admin") {
      const user = await ShopsDetails.findOneAndDelete({ _id: id });
      res.json({ message: "user removed successfully", user });
    } else {
      res.status(403).json({ error: "access denied" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

userCtrl.listUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = userCtrl;
