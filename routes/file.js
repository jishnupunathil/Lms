const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');



var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+'.'+file.originalname);
    }
});


var upload = multer({storage:store}).single('file');

router.post('/api/upload', function(req,res,next){

    upload(req,res,function(err){

        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

        

        if(err){
            return res.status(501).json({error:err});
        }
        //do all database record saving activity
        return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
    });
});


router.post('/api/download', function(req,res,next){
    

    filepath = path.join(__dirname,'../uploads') +'/'+ req.body.filename;
    res.sendFile(filepath);
});

module.exports = router;