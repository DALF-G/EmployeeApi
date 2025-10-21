// import express module
const express = require("express")
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose")

// create an express application
const app = express()

// allow the application to accept JSON data
app.use(express.json())

// Allow for cross origin resouse sharing
app.use(cors())

// specify the auth routes
const authRoutes = require('./routes/auth')
app.use("/api/auth",authRoutes)

// specify the route to access users
const usersRoutes = require("./routes/users")
app.use("/api/users", usersRoutes)

// specify the route to access departments
const departmentsRoutes = require("./routes/departments")
app.use("/api/departments", departmentsRoutes)

// specify the employees routes
const employeeRoutes = require("./routes/employees")
app.use("/api/employee",employeeRoutes);

//  connect to the database
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("mongo database connected succesfully..")).catch(err=> console.log("Unable to connect to db"))

// Specifie the port and run the app
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("The server is running on PORT 3000...")
})