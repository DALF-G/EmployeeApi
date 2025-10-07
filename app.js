// import express module
const express = require("express")
const cors = require("cors")
require('dotenv').config();

// create an express application
const app = express()

// allow the application to accept JSON data
app.use(express.json())

// Allow for cross origin resouse sharing
app.use(cors())

// Specifie the port and run the app
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("The server is running on PORT 3000...")
})