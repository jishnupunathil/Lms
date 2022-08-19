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


const adminRouter=require('./routes/adminRoute')
const trainerRouter=require('./routes/trainerRoute')
const studentRouter=require('./routes/studentRoute')
const courseRouter=require('./routes/courseRoute')
const meanRouter=require('./routes/meanRoute')
const feedbackRouter=require('./routes/feedbackRoute')

const fileRouter=require('./routes/file')











 mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true })
 .then((res)=>{
    console.log('database connected successfuly')

 }).catch((err)=>{
     console.log('error occured while connecting'+err);
 })

app.use('/admin',adminRouter)
app.use('/trainer',trainerRouter)
app.use('/student',studentRouter)
app.use('/course',courseRouter)
app.use('/mean',meanRouter)
app.use('/feedback',feedbackRouter)

  
app.use('/file',fileRouter)



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