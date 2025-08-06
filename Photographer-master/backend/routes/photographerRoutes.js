const express = require('express')
const router = express.Router()
const {
    testController,
    photographerLogin,
    photographerRegister,
} = require('../controllers/photographerControllers')

router.route('/photographer').get(testController)
router.route('/login').post(photographerLogin)
router.route('/register').post(photographerRegister)

module.exports = router
