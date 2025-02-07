
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware([1])); // Solo admin

router.get('/', pedidoController.getAll);
router.get('/pendientes', pedidoController.getPendientes);
router.put('/:id_pedido/asignar', pedidoController.asignarRepartidor);
router.put('/:id_pedido/espera', pedidoController.volverAEspera);
router.put('/:id_pedido/estado', pedidoController.cambiarEstado);

module.exports = router;