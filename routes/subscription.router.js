const express = require('express')
const { webProtection } = require('../helper/auth')
const { createSubcsription, updateSubscription, deleteSubscription ,getAllSubscription,getSubscriptionById,getSubscriptionByUserId} = require('../controllers/subscription.controller')
const router = express.Router()

router.post('/createsubscription', webProtection, createSubcsription)
router.put('/updatesubscription/:id', webProtection, updateSubscription)
router.delete('/deletesubscription/:id', webProtection, deleteSubscription)
router.get('/getsubscription', webProtection, getAllSubscription)
router.get("/getsubscriptionbyid/:id", getSubscriptionById)
router.get("/getsubscriptionbyuserid/:id", getSubscriptionByUserId)



module.exports = router


