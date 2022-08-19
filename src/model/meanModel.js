const mongoose = require('mongoose')

const meanSchema = new mongoose.Schema({

    head:{type:String},
    subhead:{type:String},
    paragraph:{type:String},


    
})

const meanModel=mongoose.model('mean',meanSchema)

module.exports=meanModel