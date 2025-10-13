const express = require("express");
const router = express.Router();
const {user} = require("../models/models");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path")

// configure the upload folder
const upload = multer({dest:"uploads/"})


// import the file system module tha will enable you to access the files of your system
const fs = require("fs")

// import the json web token to generate for you an access token
const jwt = require("jsonwebtoken")

// IMPORT THE SECRET KEY
const JWT_SECRET = process.env.JWT_SECRET

// below is the route of registering the user.
router.post("/register",upload.single('photo'), async(req, res)=>{
    try{
        // destruct the data coming from postman store the same on variables
        const {name,email,password} = req.body

        // print them out
        // console.log("The enterd name on postman is",name)
        // console.log("The enterd email on postman is",email)
        // console.log("The enterd password on postman is",password)

        // check whether the user exist
        const existingUser = await user.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "User already registered/exists"})
        }

        //  hash the passwords so that it does save as plain text
        const salt = await bcrypt.genSalt(10)

        // console.log("The salt is", salt)

        // hash the plain text password and add the salt on it
        const hashedPassword = await bcrypt.hash(password,salt)
        // console.log("The hashed password is:", hashedPassword)

        // declare a variable to hold the photos details
        let photo = null;

        // check whether there is a file passed on the request  coming from the postman
        if(req.file){
            // extract the extension of the file
        const ext = path.extname(req.file.originalname)

        // assign a new name to the file
        const newFileName = Date.now() + ext
        // specify the new path
        const newPath = path.join("uploads",newFileName)

        fs.renameSync(req.file.path, newPath);

        photo = newPath.replace(/\\/g, '/')
        }


        const User = new user({name,email,password: hashedPassword, photo})
        const saved = await User.save()

        res.status(201).json({message: "User Registered successfully", savedRecord : saved})
          
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
})



// below is the login route
router.post("/login", async(req, res)=>{
    // we shall use the email and password
    const {email, password} = req.body
    // console.log("The entered email is", email);
    // console.log("The entered password is", password);

    // Based on the email entered check wheather user exists or not
    const User = await user.findOne({email})
    console.log("The details of the person logging in are:",User)

    if(!User){
        return res.status(404).json({message: "user not found.Please check email"})
    }

    // check whether the password entered compares to the hashed password in the database
    // if they compare, it returns a boolean answer of true meaning it is correct and if they doesnt it replies false meaning password is incorrect

    const isMatch = await bcrypt.compare(password, User.password);

    if(!isMatch) {
        return res.status(400).json({message: "Invalid password. input correct password and try to login again"})
    }
    //  If both checks passes, generate an access token for the user
    const token = jwt.sign({id: User._id},JWT_SECRET,{expiresIn : '1h'})
    // console.log("The generated token is:", token)

    res.json({User,token})
    
})


module.exports = router;
