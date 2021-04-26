const express = require('express');
const loginController = require('../controllers/login');
const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', isAuth, loginController.getHome)
router.get('/admin', isAuth, isAdmin, loginController.getHomeAdmin)

router.get('/signup', loginController.getSignup)
router.post('/signup', loginController.postSignup)

router.get('/login', loginController.getLogin)
router.post('/login', loginController.postLogin)

router.post('/logout', loginController.postLogout)

module.exports = router;