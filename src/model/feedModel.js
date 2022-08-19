const mongoose = require('mongoose')

const feedSchema = new mongoose.Schema({

    name:{type:String},
    email:{type:String},
    feed:{type:String}

    
})

const feedModel=mongoose.model('feedback',feedSchema)

module.exports=feedModel