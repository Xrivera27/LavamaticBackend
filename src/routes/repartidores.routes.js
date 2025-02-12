const express = require('express');
const router = express.Router();
const repartidorController = require('../controllers/repartidorControllers');
const authMiddleware = require('../middlewares/auth');

// Proteger rutas solo para repartidores (rol 3)
router.use(authMiddleware([3]));

// Rutas específicas primero
router.get('/pedidos/entregas', repartidorController.getHistorialEntregas);  // Primero las rutas específicas
router.get('/pedidos', repartidorController.getPedidosAsignados);
router.get('/pedidos/:id_pedido', repartidorController.getPedidoDetalle);    // Después las rutas con parámetros
router.put('/pedidos/:id_pedido/estado', repartidorController.actualizarEstadoPedido);

module.exports = router;