const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// import department schema
const {department} = require("../models/models")

// Import the middleware to check whether a person is authorized or not
const auth = require("../middleware/auth");

// below is the link to fetch all the departments
router.get('/', async (req, res) => {
  try {
    const departments = await department.find();

    res.json({departments});

  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }

});

//Below is the link to fetch department by id
router.get('/:id', async (req, res) => {
  try {

    const departments = await department.findById(req.params.id);

    if (!departments) 
        return res.status(404).json({ message: 'Department not found' });
    res.json({departments});
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }

});

// add new department
router.post("/", async (req, res)=>{
    try{
        //  destructure the message from the sent request
        const {name, description} = req.body;        
        // console.log("The name of the department is:",name);
        // console.log("The description of the department is:",description);

        // create a new department
        const Department = new department({name, description})
        const savedDepartment = await Department.save()

        res.json({message: "Department saved successfully", savedDepartment :savedDepartment})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
})

// Below is the route for updating a given department
router.put("/:id", async (req, res)=>{
    try{
        // destructure the details passed with the request
        const{name, description} = req.body;
        // console.log("the updated name is:", name)
        // console.log("The updated message is:",description)

        // chech whether the department with the given id exists
        const departmentExist = await department.findByIdAndUpdate(
            req.params.id,
            {name, description, updatedAt : Date.now()},
            {new: true, runValidators :true}
        );

        if(!departmentExist){
            res.status(404).json({message: "Ooops... Department with given id does NOT Exist"})
        }
        res.json({departmentExist})
    }
    catch{
        res.status(400).json({error: err.message})
    }
})

//  below is a delete router to delete a department
router.delete("/:id", async (req, res)=>{
    try{
        const deletedDepartment = await department.findByIdAndDelete(req.params.id);
        if (!deletedDepartment) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json({ message: "Department deleted successfully", deletedDepartment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
