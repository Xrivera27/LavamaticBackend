
const express = require('express');
const router = express.Router();
const configUsuarioController = require('../controllers/configUsuarioController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware([])); // Cualquier usuario autenticado puede acceder

router.get('/profile', configUsuarioController.getProfile);
router.put('/profile', configUsuarioController.updateProfile);
router.put('/change-password', configUsuarioController.changePassword);
router.post('/deactivate', configUsuarioController.deactivateAccount);

module.exports = router;