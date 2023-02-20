const express = require('express')
const {createModule,updateModule, deleteModule} = require('../controllers/module.controller')
const {webProtection} = require('../helper/auth')
const router = express.Router()

router.post('/createmodule', webProtection ,createModule)
router.delete('/deletemodule/:id', webProtection, deleteModule)
router.put('/updatemodule/:id',webProtection, updateModule)

module.exports = router