// src/routes/reportes.routes.js
const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/ReporteController');
const authMiddleware = require('../middlewares/auth');

// Proteger rutas solo para administradores (rol 1)
router.use(authMiddleware([1]));

// Rutas para los diferentes tipos de reportes
router.get('/pedidos', reporteController.getPedidosReport);
router.get('/repartidores', reporteController.getRepartidoresReport);
router.get('/clientes', reporteController.getClientesReport);
router.get('/equipos', reporteController.getEquiposReport);
router.get('/servicios', reporteController.getServiciosReport);

// Rutas para obtener datos para los filtros
router.get('/filtros/repartidores', reporteController.getAllRepartidores);
router.get('/filtros/estados', reporteController.getAllEstados);
router.get('/filtros/clientes', reporteController.getAllClientes);

module.exports = router;