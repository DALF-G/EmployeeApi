const express = require('express');
const router = express.Router();
const {employee, department} = require('../models/models');

const auth = require("../middleware/auth");


// register a new employee
router.post("/", async(req, res)=>{
    try{
        // destructure the details entered in the postman
        const {email, departmentId} = req.body

        // console.log("The entered email address is:", email);
        // console.log("The entered departmentId is:", departmentId);

        // check based on the departmentId whether the department exists
        const existingDepartment = await department.findById(departmentId)

        if(!existingDepartment){
            return res.status(404).json({message: "Sorry, Department NOT Found"})
        }
        // check whether the email entered has been reqistered with another person/employee
        const existingEmail = await employee.findOne({email})

        if(existingEmail){
            return res.status(400).json({message: "Sorry, Employee with given Email is already Reqistered!"})
        }
        const Employee = new employee(req.body);
        await Employee.save();

        res.status(201).json({message : "Employee Registered Successfully", savedEmployee : Employee})
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
})

//  below is the route to get all the employees
router.get("/", auth,async(req, res)=>{
    try{
        const allEmployees = await employee.find().populate("userId","name email").populate("departmentId", "name")

        res.json(allEmployees)
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})

//  below is the route to fetch a single employee by Id
router.get("/:id", auth, async(req, res)=>{
    try{
        const Employee = await employee.findById(req.params.id).populate("userId","name email").populate("departmentId", "name");
        
        if(!Employee){
            return res.status(400).json({message: "Employee Not Found"});
        }
        res.json(Employee);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

// below is the update route for the employee
router.put("/:id", async(req, res)=>{
    try{
        //Destructure details sent with the incoming request
        const {userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status} = req.body;
        
        // test whether you receive all the details from post man
        // console.log("The details received are:", userId, firstName, lastName, email, department, jobTitle, hireDate, salary, status)

        if(departmentId){
            const givenDepartment = await department.findById(departmentId)

            if(!givenDepartment){
                return res.status(404).json({message: "Invalid Department. Does not Exist...."})
            }
        }

        // based on details passed, update a given employee
        const updateEmployee = await employee.findByIdAndUpdate(req.params.id,{userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status, updatedAt: Date.now()},{new:true, runValidators:true});

        //  based on the id passed on the params, check whether the employee exists or not
        if(!updateEmployee){
            res.status(400).json({message: "Employee with given ID does not EXIST!!"})
        }

        //  if the update is successsfull, return a message as wel as the new record for the employee
        res.json({message: "Employee Details updated successfully", updatedEmployee : updateEmployee})

    }
    catch(err){
        res.status(500).json({error: err.message});
        
    }
})

// Below is the route to delete a sing employee by ID

router.delete("/:id", async(req, res)=>{
    try{
        const deleteEmployee = await employee.findByIdAndDelete(req.params.id)

        if(!deleteEmployee){
            res.status(404).json({message: "Ooops... Employee not found"})
        }
        res.json({message: "Employee is successfully deleted"})
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})

module.exports = router;