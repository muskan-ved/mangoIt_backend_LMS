const express = require('express')
const {createSession, deleteSession} = require('../controllers/session.controller')
const{webProtection} = require('../helper/auth')
const router = express.Router()
const {upload} = require('../helper/upload')

router.post("/createsession", webProtection , upload.single("video"), createSession)
router.delete("/deletesession/:id", webProtection, deleteSession )

module.exports = router