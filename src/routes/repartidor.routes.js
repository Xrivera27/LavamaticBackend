
const express = require('express');
const router = express.Router();
const repartidorController = require('../controllers/repartidorController');
const authMiddleware = require('../middlewares/auth');

// Proteger rutas solo para administradores (rol 1)
router.use(authMiddleware([1]));

router.post('/', repartidorController.create);
router.get('/', repartidorController.getAll);
router.get('/:id', repartidorController.getById);
router.put('/:id', repartidorController.update);
router.delete('/:id', repartidorController.delete);

module.exports = router;