const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//load router files
const bootcamps = require("./routes/bootcamps");

const app = express();

//Dev loading middleware
app.use(morgan("dev"));
//Mounr routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5001;
const MODE = process.env.NODE_ENV;

const server = app.listen(
  PORT,
  console.log(`we are listing to port ${PORT} on mode ${MODE}`.yellow.bold)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
