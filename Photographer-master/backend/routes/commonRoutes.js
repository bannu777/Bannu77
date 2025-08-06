const express = require('express')
const router = express.Router()
const { Reserve, Reserved } = require('../controllers/common/ReserveController')
const {
    GetAllProfiles,
    EditProfile,
    ViewProfile,
    UpdateProfile,
} = require('../controllers/common/AllProfilesController')

router.route('/reserve').post(Reserve)
router.route('/Reserved/:username1').get(Reserved)
router.route('/getallprofiles').get(GetAllProfiles)
router.route('/editprofile/:username').post(EditProfile)
router.route('/updateprofile/:username').put(UpdateProfile)
router.route('/ViewProfile/:username').get(ViewProfile)

module.exports = router
