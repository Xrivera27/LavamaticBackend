const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Obtener todos los datos del dashboard
router.get('/', dashboardController.getDashboardData);

// Obtener datos específicos del dashboard
router.get('/estados', dashboardController.getPedidosPorEstado);
router.get('/repartidores', dashboardController.getPedidosPorRepartidor);
router.get('/servicios', dashboardController.getDistribucionServicios);

module.exports = router;