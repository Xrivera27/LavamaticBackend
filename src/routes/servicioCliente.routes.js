// src/routes/servicioCliente.routes.js
const express = require('express');
const router = express.Router();
const servicioClienteController = require('../controllers/servicioClienteController');
const authMiddleware = require('../middlewares/auth');

// Proteger rutas solo para clientes (rol 2)
router.use(authMiddleware([2]));

// Rutas para servicios
router.get('/servicios', servicioClienteController.getServiciosDisponibles);
router.get('/servicios/:id', servicioClienteController.getServicioDetalle);

// Rutas para horarios y disponibilidad
router.get('/horarios', servicioClienteController.getHorarios);
router.post('/disponibilidad', servicioClienteController.verificarDisponibilidad);

// Rutas para pedidos
router.post('/pedidos', servicioClienteController.crearPedido);
router.get('/pedidos', servicioClienteController.getHistorialPedidos);

module.exports = router;