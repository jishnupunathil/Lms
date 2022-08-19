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
const courseModel = require('./src/model/courseModel')
const fileRouter=require('./routes/file')

 mongoose.connect('mongodb+srv://jishnu:5YZ18pPqWACLq8CG@cluster0.otjh9.mongodb.net/lms_db?retryWrites=true&w=majority')
 .then((res)=>{
    console.log('database connected successfuly')

 }).catch((err)=>{
     console.log('error occured while connecting'+err);
 })

app.use('/admin',adminRouter)
app.use('/trainer',trainerRouter)
app.use('/student',studentRouter)
// app.use('/course',courseRouter)
app.use('/mean',meanRouter)
app.use('/feedback',feedbackRouter)

  
app.use('/file',fileRouter)


app.post('/api/course', async (req, res) => {

    console.log('body', req.body);
    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

        const courseMod = new courseModel({

            name: req.body.data.name,
            duration: req.body.data.duration,
            image: req.body.data.name,
            description: req.body.data.description
        })
        await courseMod.save()

        res.json({

            success: 1,
            message: 'Course successfuly saved'

        })

    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occuured while saving' + err
        })

    }
})


app.get('/api/course', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")
        let allcourse = await courseModel.find()
        res.json({
            success: 1,
            message: 'course listed succesfuly',
            item: allcourse
        })
    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occured while testing' + err
        })
    }
})

app.get('/api/course/:id', async (req, res) => {
    let id = req.params.id

    let ValidId = mongoose.Types.ObjectId.isValid(id)
    if (ValidId) {
        try {

            let singleCourse = await courseModel.findById({ _id: id })
            res.json({
                success: 1,
                message: 'single Course listed',
                item: singleCourse
            })


        }
        catch (err) {
            res.json({
                success: 0,
                message: 'error occured while listing single Book' + err
            })
        }

    }
    else {
        res.json({
            success: 0,
            message: 'invalid id'
        })

    }
})


app.put('/api/course/:id', async (req, res) => {
    let id = req.params.id
    validId = mongoose.Types.ObjectId.isValid(id)
    if (validId) {
        try {
            await courseModel.findByIdAndUpdate({ _id: id }, {
                $set:
                {
                    
                    name: req.body.name,
                    duration: req.body.duration,
                    image: req.body.image,
                    description: req.body.description
                }
            })
            res.json({
                success: 1,
                message: 'Book updated successfuly'
            })
        }
        catch (err) {
            res.json({
                success: 0,
                message: 'error occured while updating' + err
            })
        }
    }
})


app.delete('/api/course/:id', async (req, res) => {
    let id = req.params.id

    let validId = mongoose.Types.ObjectId.isValid(id)
    if (validId) {
        try {
            await courseModel.deleteOne({ _id: id })
            res.json({
                success: 1,
                message: 'course deleted successsfully'
            })
        }
        catch (err) {

            res.json({
                success: 0,
                message: 'error occured while deleting' + err
            })

        }
    }
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