const express = require('express')
const router = express.Router()
const meanModel = require('../src/model/meanModel')
// const mongoose = require('mongoose')



router.post('/api/add', async (req, res) => {

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


router.get('/api/', async (req, res) => {

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





module.exports = router