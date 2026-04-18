const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/authValidator');
const validateRequest = require('../middleware/validateMiddleware');

router.post('/signup', validateSignup, validateRequest, authController.signup);
router.post('/login', validateLogin, validateRequest, authController.login);

module.exports = router;
