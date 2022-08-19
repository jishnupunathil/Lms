const mongoose = require('mongoose')

const trainerSchema = new mongoose.Schema({

    firstname:{type:String},
    lastname:{type:String},
    course:{type:String},
    email:{type:String, unique:true},
    password:{type:String}
})

const trainerModel=mongoose.model('trainer',trainerSchema)

module.exports=trainerModel