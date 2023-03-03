const express = require('express')
const {createStripeCustomer,createPayment,getStripeCustomer,updateStripeCustomer,deleteStripeCustomer ,cardToken } = require('../controllers/payment.controller')
const { webProtection } = require('../helper/auth')

const router = express.Router()

router.post('/createpayment', webProtection, createPayment)
router.get('/getstripecustomer/:id', webProtection, getStripeCustomer)
// router.post('/updatestripecustomer/:id',webProtection, updateStripeCustomer)
router.delete('/deletestripecustomer/:id',webProtection, deleteStripeCustomer)
router.post('/cardtoken',webProtection, cardToken)

module.exports = router