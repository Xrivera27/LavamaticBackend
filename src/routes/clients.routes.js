const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware([1])); // Solo admin

router.get('/', clientController.getAll);
router.post('/create', clientController.register); // Creación por admin
router.put('/:id', clientController.update);
router.delete('/:id', clientController.delete);

module.exports = router;