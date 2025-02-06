const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');

router.post('/login', authController.login);
router.post('/register', clientController.register); // Auto-registro público
router.post('/reset-password', authController.resetPassword);

module.exports = router;