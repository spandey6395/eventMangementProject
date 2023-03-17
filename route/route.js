const express = require('express');
const router=express.Router()
const user = require('../controller/userController')
const event = require('../controller/eventController')
const auth = require('../middleware/userAuth')

// User routes
router.post('/register', user.userRegister);
router.post('/login', user.login);
router.post('/logout',user.logout);
router.post('changePassword',user.changePassword);
router.post('updatepassword', user.updatePassword);
router.post('resetPassword',user.resetPassword)

// Event routes

router.post('/event',auth,event.createEvent);
router.get('/getevent',auth,event.getEvent);

module.exports=router;