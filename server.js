const express = require("express");
const dontenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const bootcamps = require("./routes/bootcamps");

// Load env vars
dontenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Init express
const app = express();

// Midleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server $ exit process
  server.close(() => process.exit(1));
});
