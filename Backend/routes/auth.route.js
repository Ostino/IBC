const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const requireUser = require('../middlewares/requiredUser');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', requireUser, authController.logout);
router.post('/logoutAll', requireUser, authController.logoutAll);



module.exports = router;
