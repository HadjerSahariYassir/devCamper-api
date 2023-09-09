const express = require("express")
const dotenv = require("dotenv")

//load env vars
dotenv.config({ path : "./config/config.env"})

const PORT = process.env.PORT || 5001
const MODE = process.env.NODE_ENV 

const app = express()

app.listen(PORT,
    console.log(`we are listing to port ${PORT} on mode ${MODE}`)
)