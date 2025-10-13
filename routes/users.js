const express = require("express");
const router = express.Router();

// import the user schema
const {user} = require("../models/models")

// Import the middleware to check whether a person is authorized or not
const auth = require("../middleware/auth");

// below is the link to fetch all the users
router.get("/",auth, async(req, res)=>{
    try{
        // find all the users and store them inside the variable user
        const User = await user.find()

        // return them as the response
        res.json(User)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router