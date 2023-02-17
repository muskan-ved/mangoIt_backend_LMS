const express = require('express')
const {createModule, deleteModule} = require('../controllers/module.controller')
const {webProtection} = require('../helper/auth')
const router = express.Router()

router.post('/createmodule', webProtection ,createModule)
router.delete('/deletemodule/:id', webProtection, deleteModule)

module.exports = router