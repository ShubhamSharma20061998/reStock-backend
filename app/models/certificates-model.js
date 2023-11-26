const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const certificateSchema = new Schema(
  {
    type: String,
    default: null,
  },
  { timestamps: true }
);

const Certificates = model("Certificate", certificateSchema);

module.exports = Certificates;
