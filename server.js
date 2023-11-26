require("dotenv").config();
const express = require("express");
const cors = require("cors");
const configureDB = require("./config/db");

const app = express();
const port = 3090;

const routes = require("./routes/routes");

configureDB();

app.use(express.json());
app.use(cors());
app.use("/", routes);

app.listen(port, () => {
  console.log("server listening on port", port);
});
