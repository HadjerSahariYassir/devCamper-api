const express = require("express")
const {
    getBootCamps,
    getBootCamp,
    createBootCamp,
    updateBootCamp,
    deleteBootCamp
} = require("../controllers/bootcamps")

const router = express.Router()


router.get(('/'), (req, res) => {
    res.status(200).send(({ success: true, msg: "get all bootcamps"}))
})

router.get(('/:id'), (req, res) => {
    res.status(200).send(({ success: true, msg: `get bootcamp ${req.params.id}`}))
})

router.post(('/'), (req, res) => {
    res.status(201).send(({ success: true, msg: "create a  new bootcamp"}))
})

router.put(('/:id'), (req, res) => {
    res.status(200).send(({ success: true, msg: `update bootcamp ${req.params.id}`}))
})

router.delete(('/:id'), (req, res) => {
    res.status(200).send(({ success: true, msg: `delete bootcamp ${req.params.id}`}))
})

module.exports = router