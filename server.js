const express = require("express");
const dontenv = require("dotenv");

// Load env vars
dontenv.config({ path: "./config/config.env" });

// Init express
const app = express();

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
