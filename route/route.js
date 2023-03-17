const express = require('express');
const router=express.Router()
const user = require('../controller/userController')
const event = require('../controller/eventController')
const auth = require('../middleware/userAuth')

// User routes
router.post('/register', user.userRegister);
router.post('/login', user.login);
router.post('/logout',user.logout);
router.put('changePassword',user.changePassword);
router.put('updatepassword', user.updatePassword);
router.put('resetPassword',user.resetPassword)

// Event routes

router.post('/event',auth,event.createEvent);
router.get('/getevent',auth,event.getEvent);

module.exports=router;