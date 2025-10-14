const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

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

// view a single user
router.get("/:id",auth,async(req, res)=>{
    try{
        const User = await user.findById(req.params.id);

        // console.log("The req.param.id is:",req.params.id)

        // chech whether there is a record returned
        if(!User){
            return res.sendStatus(400).json({message: "sorry, user not FOUND....!"})
        }

        // if the user is there, return the details of the user
        res.json(User);
    }
    catch{
        res.status(500).json({message:err.message})
    }
})

// update a user based on id
router.put("/:id",async(req, res)=>{
    try{
        // destructure the content you want to update from the sent request
        const{name, email,password} = req.body;

        // console.log("the name entered is:",name);
        // console.log("The email entered is:",email);
        // console.log("The password entered is:",password)

        // check if user exists or not based on the id passed as a parameter.
        const User = await user.findById(req.params.id)
        if(!User){
            res.status(404).json({message: "Ooops, User not found...Please checK the id"})
        }
        // Prepare the update data
        let updateData = {name,email}

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        // update the user with the new details
        const updateUser = await user.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new : true}
        )
        res.json(updateUser)
    }
    catch(err){
        res.status(400).json({message : err.message})
    }
})

// below is the delete router
router.delete("/:id",async(req,res)=>{
    try{
        // attempt to find a user by his/her id and delete them
        const deleteUser = await user.findByIdAndDelete(req.params.id)

        // if the id of the user does not exist, give a response back to the person
        if(!deleteUser){
            res.status(404).json({message: "Ooops... User not found"})
        }
        // if deletion has happened successfully, send a success message
        res.json({message: "User successfully deleted"})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})
// below
module.exports = router