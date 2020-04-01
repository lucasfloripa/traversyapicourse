const express = require("express");
const path = require("path");
const dontenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// Load env vars
dontenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT;

// Connect to database
connectDB();

// Init express
const app = express();

// Middleware Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Fileupload
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// Middleware errorHandler
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server $ exit process
  server.close(() => process.exit(1));
});
