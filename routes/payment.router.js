const express = require('express')
const {createStripeCustomer,createPayment,getStripeCustomer,updateStripeCustomer,deleteStripeCustomer ,cardToken } = require('../controllers/payment.controller')
const { webProtection } = require('../helper/auth')

const router = express.Router()

router.post('/payment', webProtection, createPayment)
router.get('/payment/:id', webProtection, getStripeCustomer)
router.put('/payment/:id',webProtection, updateStripeCustomer)
router.delete('/payment/:id',webProtection, deleteStripeCustomer)

router.post('/cardtoken',webProtection, cardToken)

module.exports = router