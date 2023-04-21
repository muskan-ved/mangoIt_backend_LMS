const express = require('express')
const {getModules,getModuleById,getModuleBySearch, createModule, updateModule, deleteModule } = require('../controllers/module.controller')
const { webProtection } = require('../helper/auth')
const router = express.Router()

router.get('/getmodules', webProtection, getModules)
router.get('/getmodule/:id',webProtection, getModuleById)
router.get("/getmodulebysearch", webProtection, getModuleBySearch)
router.post('/createmodule', webProtection, createModule)
router.put('/updatemodule/:id', webProtection, updateModule)
router.delete('/deletemodule/:id', webProtection, deleteModule)


module.exports = router