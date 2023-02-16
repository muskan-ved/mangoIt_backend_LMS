const express = require('express')
const {createSession} = require('../controllers/session.controller')
const router = express.Router()
const {upload} = require('../helper/upload')

router.post("/createsession", upload.single("video"), createSession)

module.exports = router