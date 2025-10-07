// import mongose module
// this will help to connect to mongo database
const mongoose =require("mongoose")

// create a schema from the mongoose module
const schema = mongoose.Schema;

const userSchema = new Schema({
    name : String,
    email : {type: String,required : true, unique: true},
    dob : {type : Date, default : Date.now},
    password: {type: String, required:true},
    photo :String
});

// employee schema
const employeeShema = new Schema({
    userId : {type: mongoose.Schema.Types.ObjectId,ref: 'user',default:null},
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email : {type: String,required : true, unique: true},
    departmentId : {type: Schema.Types.ObjectId, ref: 'department', required: true},
    jobTitle : {type: String, required:true},
    salary : {type: Number},
    status : {type: String, enum: ['active','inactive', 'on_leave'], default:'active'},
    createdAt : {type: Date, default: Date.now},
    updatedAt : {type: Date, default: Date.now}
});

// department schema
const departmentSchema = new Schema({
    name : {type: String, required:true, unique:true},
    description :{type: String},
    manangerId : {type: Schema.Types.ObjectId, ref: 'employee', default:null},
    createdAt : {type: Date, default: Date.now},
    updatedAt : {type: Date, default: Date.now}
})

// export all the schemas
const user = mongoose.model('user', userSchema);
const department = mongoose.model('department', departmentSchema);
const employee = mongoose.model('employee', employeeShema);

module.exports = {user, department, employee};