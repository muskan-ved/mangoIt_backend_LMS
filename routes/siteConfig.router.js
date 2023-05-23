const express = require('express')
const {webProtection} = require('../helper/auth')
const { getAllSiteConfig, getSiteConfigById, createSiteConfig, updateSiteConfig, deleteSiteConfig } = require('../controllers/siteconfiguration.controller')
const router = express.Router()

router.get('/getsiteconfigs', webProtection, getAllSiteConfig)
router.get('/getsiteconfigs/:id', webProtection, getSiteConfigById)
router.post('/createsiteconfig', webProtection , createSiteConfig)
router.put('/updatesiteconfigs/:id',webProtection,  updateSiteConfig)
router.delete('/deletesiteconfigs/:id', webProtection ,deleteSiteConfig)

module.exports = router