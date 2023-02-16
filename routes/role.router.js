const express = require('express')
const {getAuthToken} = require('../controllers/role.controller')
const router = express.Router()

router.post('/generatetoken', getAuthToken)

module.exports = router