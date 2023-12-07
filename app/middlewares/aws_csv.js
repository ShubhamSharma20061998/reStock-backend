// Get CSV from S3 and convert it to JSON with Node.js

require("dotenv").config();
const AWS = require("aws-sdk");
const csv = require("csvtojson");
const S3 = new AWS.S3();
const params = {
  Bucket: "bucket name",
  Key: "csv file name",
};
async function csvToJSON() {
  // get csv file and create stream
  const stream = S3.getObject(params).createReadStream();
  // convert csv file (stream) to JSON format data
  const data = await csv().fromStream(stream);
  console.log(data);
}
module.exports = csvToJSON;
