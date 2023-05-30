const express = require('express')
const {getOrdres, getOrderById, createOrder, updateOrder, deleteOrder,getOrderByUserId} = require('../controllers/order.controller')
const {webProtection} = require('../helper/auth')
const router = express.Router()

router.get('/getorders', webProtection, getOrdres)
router.get('/getorder/:id', webProtection, getOrderById)
router.post('/createorder', webProtection , createOrder)
router.put('/updateorder/:id',webProtection,  updateOrder)
router.delete('/deleteorder/:id', webProtection ,deleteOrder)
router.get("/getorderbyuserid/:id", getOrderByUserId)


module.exports = router