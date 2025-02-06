
const express = require('express');
const router = express.Router();

//clientes

const clientsRoutes = require('./clients.routes');

// login
const authRoutes = require('./auth.routes');

//repartidores
const repartidorRoutes = require('./repartidor.routes');

//configuraciones Usuario
const configUsuarioRoutes = require('./configUsuario.routes');

//Equipos
const equipoRoutes = require('./equipo.routes');

//Servicios
const servicioRoutes = require('./servicio.routes');

//Mantenimientos
const mantenimientoEquipoRoutes = require('./mantenimientoEquipo.routes');



//clientes
router.use('/clients', clientsRoutes);

// login
router.use('/auth', authRoutes);

//repartidores
router.use('/repartidores', repartidorRoutes);

//configuraciones Usuario
router.use('/config', configUsuarioRoutes);

//Equipos
router.use('/equipos', equipoRoutes);

//Servicios
router.use('/servicios', servicioRoutes);

//Mantenimientos
router.use('/mantenimientos', mantenimientoEquipoRoutes);

module.exports = router;