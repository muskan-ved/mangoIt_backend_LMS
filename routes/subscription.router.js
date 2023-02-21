const express = require('express')
const { webProtection } = require('../helper/auth')
const { createSubcsription, updateSubscription, deleteSubscription } = require('../controllers/subscription.controller')
const router = express.Router()

router.post('/createsubscription', webProtection, createSubcsription)
router.put('/updatesubscription/:id', webProtection, updateSubscription)
router.delete('/deletesubscription/:id', webProtection, deleteSubscription)



module.exports = router