const express = require('express')
const app = express()
const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
const cors = require('cors')
const bodyParser=require('body-parser')
const path = require('path')



app.use(express.static(`./dist/lms`))

app.use(cors())
app.use(bodyParser.json())


// const adminRouter=require('./routes/adminRoute')
//admin
const adminModel = require('./src/model/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth=require('./middleware/check_admAuth')


const trainerRouter=require('./routes/trainerRoute')
const studentRouter=require('./routes/studentRoute')
const courseRouter=require('./routes/courseRoute')
const meanRouter=require('./routes/meanRoute')
const feedbackRouter=require('./routes/feedbackRoute')
const fileRouter=require('./routes/file')

 mongoose.connect('mongodb+srv://jishnu:5YZ18pPqWACLq8CG@cluster0.otjh9.mongodb.net/lms_db?retryWrites=true&w=majority')
 .then((res)=>{
    console.log('database connected successfuly')

 }).catch((err)=>{
     console.log('error occured while connecting'+err);
 })

// app.use('/admin',adminRouter)
app.use('api/trainer',trainerRouter)
app.use('/student',studentRouter)
app.use('/course',courseRouter)
app.use('/mean',meanRouter)
app.use('/feedback',feedbackRouter)
app.use('/file',fileRouter)

//adminRoute
app.get('/api/admin', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")
        let alladmin = await adminModel.find()
        res.json({
            success: 1,
            message: 'student listed succesfuly',
            item: alladmin
        })
    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occured while testing' + err
        })
    }
})


app.post('/api/admin/login', (req, res) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")


    adminModel.find({ email: req.body.data.email })
        .exec()
        .then((result) => {
            if (result.length < 1) {
                return res.json({
                    success: 0,
                    message: 'Account doesnt exist'
                })
            }
            const user = result[0]
            bcrypt.compare(req.body.data.password, user.password, (err, ret) => {
                if (ret) {
                    const payload = {
                        userId: user._id
                    }
                    const token = jwt.sign(payload, 'BatchWeb')
                    return res.json({
                        success: 1,
                        token: token,
                        message: 'login Successfull'
                    })
                }
                else {
                    return res.json({
                        success: 0,
                        message: 'wrong password '
                    })


                }


            })
        })
        .catch((err) => {
            res.json({
                success: 0,
                message: 'Auth failed'
            })
        })
})

 app.get('/api/admin/profile',checkAuth,(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

    const userId=req.userData.userId
    adminModel.findById(userId)
    .exec()
    .then((result)=>{
        res.json({
            success:1,
            data:result
        })
    })
    .catch(err=>{
        res.json({
            success:0,
            message:'server error'
        })
    })


 
})





































app.post('/api/mail',(req,res)=>{
    console.log('request came');
    let user=req.body

    sendMail(user,info=>{
        console.log(`The mail has been send and the id is ${info.messageId}`)
        res.send(info)
    })
})

async function sendMail(user,callback){
    let transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'jishnupunathil000@gmail.com',
            pass:'lgyhyqrrvxkkwder'

        }
    })

    let mailOptions={
        from:'GURUKUL Adminstrator',
        to:user.email,
        subject:'GURUKUL login details',
        html:`<h2>Dear ${user.firstname} ${user.lastname},</h2><br>
        <h4> You are now a part of this community<br>
        kindly login  with the credential listed below</h4>
        <h3>UserEmail: ${user.email}</h3>
        <h3>password: ${user.password}</h3><br><br>
        <h3> Thank you from ICTAK`
    }

    let info=await transporter.sendMail(mailOptions)

    callback(info)
}





app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/lms/index.html'));
   });

app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log('listenning to port 3000');
})