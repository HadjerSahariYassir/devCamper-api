const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error")
const path = require('path')
//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//load router files
const bootcamps = require("./routes/bootcamps");
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const fileUpload = require("express-fileupload");
//load cokieparser
const cookieParser = require('cookie-parser');
const app = express();

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev loading middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

//File uploading 
app.use(fileUpload());

//Set a static folder
app.use(express.static(path.join(__dirname,'public')))
//Mounr routers
app.use("/api/v1/bootcamps", bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth', auth);

//error handler
app.use(errorHandler)
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
