const express = require("express");
const dontenv = require("dotenv");

// Route files
const bootcamps = require("./routes/bootcamps");

// Load env vars
dontenv.config({ path: "./config/config.env" });

// Init express
const app = express();

app.use("/api/v1/bootcamps", bootcamps);

// Creating Routes
// app.get("/", (req, res) => {
//   res.send("Hello Express!");
//   res.json({ name: "Lucas "});
//   res.sendStatus(400 or any other http status);
//   res.status(200).json({ success: false, data: { id: "1"}});
// });

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
