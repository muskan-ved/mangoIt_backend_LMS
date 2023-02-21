const express = require('express')
const {createSession,updateSession, deleteSession} = require('../controllers/session.controller')
const{webProtection} = require('../helper/auth')
const router = express.Router()
const {upload} = require('../helper/upload')

router.post("/createsession", webProtection , upload.single("upload"), createSession)
router.put("/updatesession/:id", webProtection, upload.single("upload"), updateSession )
router.delete("/deletesession/:id", webProtection, deleteSession )


module.exports = router