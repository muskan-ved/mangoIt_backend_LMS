const express = require('express')
const {getSessions,getSessionById,getSessionBySearch,createSession,updateSession, deleteSession} = require('../controllers/session.controller')
const{webProtection} = require('../helper/auth')
const router = express.Router()
const {upload} = require('../helper/upload')

router.get("/getsessions", webProtection, getSessions)
router.get("/getsession/:id",webProtection, getSessionById)
router.get("/getsessionbysearch", webProtection, getSessionBySearch)
router.post("/createsession", webProtection , upload.single("audio_video"), createSession)
router.put("/updatesession/:id", webProtection, upload.single("audio_video"), updateSession )
router.delete("/deletesession/:id", webProtection, deleteSession )


module.exports = router