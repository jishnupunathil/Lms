const express = require('express')
const router = express.Router()
const feedModel = require('../src/model/feedModel')
const mongoose = require('mongoose')

router.get('/api/', async (req, res) => {

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
router.post('/api/add', async (req, res) => {

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
module.exports=router;