const express = require('express');
const userAuth = require('../middlewares/auth')
const router = express.Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController')

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/getLoggedInUser',userAuth.authenticate, userController.getLoggedInUser);

router.post('/isTheUserIsAdminOfTheActiveGroup', userAuth.authenticate, adminController.isTheUserIsAdminOfTheActiveGroup)

router.post('/removeUser', userAuth.authenticate, adminController.removeUser)
router.post('/makeAdmin', userAuth.authenticate, adminController.makeAdmin)

module.exports = router;