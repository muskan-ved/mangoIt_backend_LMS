const express = require('express')
const {createOrder, updateOrder, deleteOrder} = require('../controllers/order.controller')
const {webProtection} = require('../helper/auth')
const router = express.Router()

router.post('/createorder', webProtection , createOrder)
router.put('/updateorder/:id',webProtection,  updateOrder)
router.delete('/deleteorder/:id', webProtection ,deleteOrder)

module.exports = router