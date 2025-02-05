
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



//clientes
router.use('/clients', clientsRoutes);

// login
router.use('/auth', authRoutes);

//repartidores
router.use('/repartidores', repartidorRoutes);

//configuraciones Usuario
router.use('/config', configUsuarioRoutes);

module.exports = router;