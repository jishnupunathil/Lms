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


// const trainerRouter=require('./routes/trainerRoute')
//trainer
const trainerModel = require('./src/model/trainerModel')
const checkTrnrAuth = require('./middleware/check_trnAuth')


// const studentRouter=require('./routes/studentRoute')
//student


const studentModel = require('./src/model/studentModel')
const checkStdAuth = require('./middleware/check_auth')


// const courseRouter=require('./routes/courseRoute')
//course
const courseModel = require('./src/model/courseModel')


// const meanRouter=require('./routes/meanRoute')
//mean
const meanModel = require('./src/model/meanModel')



// const feedbackRouter=require('./routes/feedbackRoute')
//feedback
const feedModel = require('./src/model/feedModel')


const fileRouter=require('./routes/file')

 mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
 .then((res)=>{
    console.log('database connected successfuly')

 }).catch((err)=>{
     console.log('error occured while connecting'+err);
 })

// app.use('/admin',adminRouter)
// app.use('api/trainer',trainerRouter)
// app.use('/student',studentRouter)
// app.use('/course',courseRouter)
// app.use('/mean',meanRouter)
// app.use('/feedback',feedbackRouter)
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

//trainerRoute

app.post('/api/trainer/signUp', (req, res) => {

    console.log('body', req.body);

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

    bcrypt.hash(req.body.data.password, 10, (err, hash) => {
        if (err) {
            return res.json({

                success: 0,
                message: 'Hashing issue'

            })
        }
        else {
            const trainerMod = new trainerModel({
                firstname: req.body.data.firstname,
                lastname: req.body.data.lastname,
                course: req.body.data.course,
                email: req.body.data.email,
                password: hash
            })
            trainerMod.save()
                .then((_) => {
                    res.json({

                        success: 1,
                        message: 'Trainer Account created successfully'

                    })
                })
                .catch((err) => {
                    if (err.code === 11000) {
                        return res.json({
                            success: 0,
                            message: 'Account already Exist,Please login'
                        })
                    }
                    res.json({
                        success: 0,
                        message: 'Auth Failed'
                    })

                })

        }
    })
})


app.get('/api/trainer', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")
        let alltrainer = await trainerModel.find()
        res.json({
            success: 1,
            message: 'trainer listed succesfuly',
            item: alltrainer
        })
    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occured while testing' + err
        })
    }
})


app.post('/api/trainer/login', (req, res) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")


    trainerModel.find({ email: req.body.data.email })
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
                    const token = jwt.sign(payload, 'secretKey')
                    return res.json({
                        success: 1,
                        token: token,
                        message: 'login Successfull'
                    })
                }
                else {
                    return res.json({
                        success: 0,
                        message: ' wrong password '
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


app.get('/api/trainer/profile', checkTrnrAuth, (req, res) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

    const userId = req.userData.userId
    trainerModel.findById(userId)
        .exec()
        .then((result) => {
            res.json({
                success: 1,
                data: result
            })
        })
        .catch(err => {
            res.json({
                success: 0,
                message: 'server error'
            })
        })
})

app.get('/api/trainer/:id',async(req,res)=>{
    let id=req.params.id

    let ValidId=mongoose.Types.ObjectId.isValid(id)
    if(ValidId){
        try{

            let singleTrainer=await trainerModel.findById({_id:id})
            res.json({
                success:1,
                message:'single student listed',
                item:singleTrainer
            })


        }
        catch(err){
            res.json({
                            success:0,
                            message:'error occured while listing single student'+err
                    })
        }

    }
    else{
        res.json({
            success:0,
            message:'invalid id'
        })

    }
})

app.delete('/api/trainer/:id', async (req, res) => {
    let id = req.params.id

    let validId = mongoose.Types.ObjectId.isValid(id)
    if (validId) {
        try {
            await trainerModel.deleteOne({ _id: id })
            res.json({
                success: 1,
                message: 'trainer removed successsfully'
            })
        }
        catch (err) {

            res.json({
                success: 0,
                message: 'error occured while removing' + err
            })

        }
    }
})

//student








app.post('/api/tudent/signUp', (req, res) => {

    console.log('body', req.body);

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

    bcrypt.hash(req.body.data.password, 10, (err, hash) => {
        if (err) {
            return res.json({

                success: 0,
                message: 'Hashing issue'

            })
        }
        else {
            const studentMod = new studentModel({
                firstname: req.body.data.firstname,
                lastname: req.body.data.lastname,
                course: req.body.data.course,
                email: req.body.data.email,
                password: hash
            })
            studentMod.save()
                .then((_) => {
                    res.json({

                        success: 1,
                        message: 'student Account create successfully'

                    })
                })
                .catch((err) => {
                    if (err.code === 11000) {
                        return res.json({
                            success: 0,
                            message: 'Account already Exist,Please login'
                        })
                    }
                    res.json({
                        success: 0,
                        message: 'Auth Failed'
                    })

                })

        }
    })
})


app.get('/api/student', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")
        let allstudent = await studentModel.find()
        res.json({
            success: 1,
            message: 'student listed succesfuly',
            item: allstudent
        })
    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occured while testing' + err
        })
    }
})


app.post('/api/student/login', (req, res) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")


    studentModel.find({ email: req.body.data.email })
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
                    const token = jwt.sign(payload, 'webBatch')
                    return res.json({
                        success: 1,
                        token: token,
                        message: 'login Successfull'
                    })
                }
                else {
                    return res.json({
                        success: 0,
                        message: ' wrong password '
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

app.get('/api/student/profile', checkStdAuth, (req, res) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

    const userId = req.userData.userId
    studentModel.findById(userId)
        .exec()
        .then((result) => {
            res.json({
                success: 1,
                data: result
            })
        })
        .catch(err => {
            res.json({
                success: 0,
                message: 'server error'
            })
        })



})

app.get('/api/student/:id',async(req,res)=>{
    let id=req.params.id

    let ValidId=mongoose.Types.ObjectId.isValid(id)
    if(ValidId){
        try{

            let singleStudent=await studentModel.findById({_id:id})
            res.json({
                success:1,
                message:'single student listed',
                item:singleStudent
            })


        }
        catch(err){
            res.json({
                            success:0,
                            message:'error occured while listing single student'+err
                    })
        }

    }
    else{
        res.json({
            success:0,
            message:'invalid id'
        })

    }
})

app.delete('/api/student/:id', async (req, res) => {
    let id = req.params.id

    let validId = mongoose.Types.ObjectId.isValid(id)
    if (validId) {
        try {
            await studentModel.deleteOne({ _id: id })
            res.json({
                success: 1,
                message: 'Student removed successsfully'
            })
        }
        catch (err) {

            res.json({
                success: 0,
                message: 'error occured while removing' + err
            })

        }
    }
})

//courseRoute

app.post('/api/course/add', async (req, res) => {

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
            message: 'Course listed succesfuly',
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

//meanRoute


app.post('/api/mean/add', async (req, res) => {

    console.log('body', req.body);
    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

        const meanMod = new meanModel({

            head: req.body.head,
            subhead: req.body.subhead,
            paragraph: req.body.paragraph,
            
        })
        await meanMod.save()

        res.json({

            success: 1,
            message: 'mean about successfuly saved'

        })

    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occuured while saving' + err
        })

    }
})


app.get('/api/mean', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")
        let allmean = await meanModel.find()
        res.json({
            success: 1,
            message: 'mean listed succesfuly',
            item: allmean
        })
    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occured while testing' + err
        })
    }
})
//feedBackRoute

app.get('/api/feedback', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")
        let allfeed = await feedModel.find()
        res.json({
            success: 1,
            message: 'All feedbacks',
            item: allfeed
        })
    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occured while testing' + err
        })
    }
})
app.post('/api/feedback/add', async (req, res) => {

    console.log('body', req.body);
    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")

        const feedMod = new feedModel({

            name: req.body.data.name,
            email: req.body.data.email,
            feed: req.body.data.feed
        })
        await feedMod.save()

        res.json({

            success: 1,
            message: 'Feedback saved'

        })

    }
    catch (err) {
        res.json({
            success: 0,
            message: 'error occuured while saving' + err
        })

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