const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{

    try{
    const token=req.headers.authorization.split(' ')[1]
    const decode=jwt.verify(token,'BatchWeb')
    req.userData=decode
    next()
    }catch(error){
        res.json({
            success:0,
            message:'Auth 1 Failed'
        })
    }
}