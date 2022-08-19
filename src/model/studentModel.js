const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({

    firstname:{type:String},
    lastname:{type:String},
    course:{type:String},
    email:{type:String, unique:true},
    password:{type:String}
})

const studentModel=mongoose.model('student',studentSchema)

module.exports=studentModel