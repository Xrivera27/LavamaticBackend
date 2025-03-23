const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const authMiddleware = require('../middlewares/auth');

// Permitir acceso a roles 1 (admin) y 2 (cliente) para endpoints GET
router.get('/', authMiddleware([1, 2]), servicioController.getAll);
router.get('/:id', authMiddleware([1, 2]), servicioController.getById);

// Mantener restricción de solo admin para operaciones de modificación
router.post('/', authMiddleware([1]), servicioController.create);
router.put('/:id', authMiddleware([1]), servicioController.update);
router.delete('/:id', authMiddleware([1]), servicioController.delete);

module.exports = router;