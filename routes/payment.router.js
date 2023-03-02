const express = require('express')
const {createStripeCustomer,createPayment, cardToken } = require('../controllers/payment.controller')
const { webProtection } = require('../helper/auth')

const router = express.Router()

router.post('/createstripecustomer', webProtection, createStripeCustomer)
router.post('/cardtoken',webProtection, cardToken)
router.post('/createpayment', webProtection, createPayment)


module.exports = router