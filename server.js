const express = require("express")
const dotenv = require("dotenv")

//load router files
const bootcamps = require("./routes/bootcamps")

//load env vars
dotenv.config({ path : "./config/config.env"})

const app = express()

//Mounr routers
app.use("/api/v1/bootcamps", bootcamps)

const PORT = process.env.PORT || 5001
const MODE = process.env.NODE_ENV 

app.listen(PORT,
    console.log(`we are listing to port ${PORT} on mode ${MODE}`)
)