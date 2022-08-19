const express = require('express')
const router = express.Router()
const courseModel = require('../src/model/courseModel')
const mongoose = require('mongoose')


router.post('/api/add', async (req, res) => {

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


router.get('/api/', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE")
        let allcourse = await courseModel.find()
        res.json({
            success: 1,
            message: 'books listed succesfuly',
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

router.get('/api/:id', async (req, res) => {
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


router.put('/api/:id', async (req, res) => {
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


router.delete('/api/:id', async (req, res) => {
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


module.exports = router