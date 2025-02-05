// src/controllers/repartidorController.js
const bcrypt = require('bcrypt');
const repartidorService = require('../services/repartidorService');
const userService = require('../services/userService');

class RepartidorController {
 async create(req, res) {
   try {
     const {
       nombre,
       email,
       password,
       telefono,
       direccion,
       codigo_mochila,
       gps_asignado
     } = req.body;

     const existingUser = await userService.getUserByEmail(email);
     if (existingUser) {
       return res.status(400).json({ error: 'El email ya está registrado' });
     }

     const hashedPassword = await bcrypt.hash(password, 10);
     
     const usuario = await userService.createUser({
       nombre,
       email,
       password: hashedPassword,
       telefono,
       direccion,
       id_rol: 3,
       activo: true
     });
     
     const repartidor = await repartidorService.createRepartidor({
       id_usuario: usuario.id_usuario,
       codigo_mochila,
       gps_asignado,
       estado: 'activo'
     });
     
     res.status(201).json({
       message: 'Repartidor creado exitosamente',
       repartidor: {
         ...repartidor.toJSON(),
         usuario: {
           nombre: usuario.nombre,
           email: usuario.email,
           telefono: usuario.telefono
         }
       }
     });
   } catch (error) {
     res.status(500).json({ error: 'Error al crear repartidor' });
   }
 }

 async getAll(req, res) {
   try {
     const repartidores = await repartidorService.getAllRepartidores();
     res.json(repartidores);
   } catch (error) {
     res.status(500).json({ error: 'Error al obtener repartidores' });
   }
 }

 async getById(req, res) {
   try {
     const repartidor = await repartidorService.getRepartidorById(req.params.id);
     if (!repartidor) {
       return res.status(404).json({ error: 'Repartidor no encontrado' });
     }
     res.json(repartidor);
   } catch (error) {
     res.status(500).json({ error: 'Error al obtener repartidor' });
   }
 }

 async update(req, res) {
   try {
     const id = req.params.id;
     const {
       nombre,
       email,
       telefono,
       direccion,
       codigo_mochila,
       gps_asignado
     } = req.body;

     const repartidor = await repartidorService.getRepartidorById(id);
     if (!repartidor) {
       return res.status(404).json({ error: 'Repartidor no encontrado' });
     }

     if (email) {
       const existingUser = await userService.getUserByEmail(email);
       if (existingUser && existingUser.id_usuario !== repartidor.id_usuario) {
         return res.status(400).json({ error: 'El email ya está registrado' });
       }
     }

     if (nombre || email || telefono || direccion) {
       await userService.updateUser(repartidor.id_usuario, {
         nombre,
         email,
         telefono,
         direccion
       });
     }

     if (codigo_mochila || gps_asignado) {
       await repartidorService.updateRepartidor(id, {
         codigo_mochila,
         gps_asignado
       });
     }

     const updatedRepartidor = await repartidorService.getRepartidorById(id);
     res.json({ 
       message: 'Repartidor actualizado correctamente',
       repartidor: updatedRepartidor
     });
   } catch (error) {
     res.status(500).json({ error: 'Error al actualizar repartidor' });
   }
 }

 async delete(req, res) {
   try {
     const id_usuario = req.params.id;
     
     const repartidor = await repartidorService.getRepartidorByUserId(id_usuario);
     if (!repartidor) {
       return res.status(404).json({ error: 'Repartidor no encontrado' });
     }

     await userService.softDelete(id_usuario);
     await repartidorService.deleteRepartidor(repartidor.id_repartidor);

     res.json({ 
       message: 'Repartidor y usuario desactivados correctamente'
     });
   } catch (error) {
     res.status(500).json({ error: 'Error al desactivar repartidor' });
   }
 }
}

module.exports = new RepartidorController();