const express = require('express')
const {createPayment} = require('../controllers/payment.controller')
const { webProtection } = require('../helper/auth')

const router = express.Router()

router.post('/createpayment', webProtection, createPayment)

module.exports = router