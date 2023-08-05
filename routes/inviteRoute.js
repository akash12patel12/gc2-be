const express = require('express');
const userAuth = require('../middlewares/auth')
const router = express.Router();
const userController = require('../controllers/userController');
const inviteController = require('../controllers/inviteController')

router.post('/inviteuser', userAuth.authenticate ,inviteController.sendInvite )
router.get('/seeGroupInvites' , userAuth.authenticate , inviteController.seeGroupInvites)
router.post('/acceptInvite', userAuth.authenticate, inviteController.acceptInvite)
router.post('/rejectInvite', userAuth.authenticate, inviteController.rejectInvite)
router.post('/seeGroupUsers',userAuth.authenticate, userController.seeGroupUsers);

module.exports = router;