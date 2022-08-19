const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({

    name:{type:String},
    duration:{type:String},
    image:{type:String},
    description:{type:String},

    
})

const courseModel=mongoose.model('course',courseSchema)

module.exports=courseModel