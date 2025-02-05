// src/repositories/repartidorRepository.js
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const Usuario = require('../models/User');
const Repartidor = require('../models/repartidores')(sequelize, DataTypes);

// Establecer la asociación
Repartidor.belongsTo(Usuario, { foreignKey: 'id_usuario' });

class RepartidorRepository {
 async create(repartidorData) {
   try {
     console.log('Intentando crear repartidor con datos:', repartidorData);
     const nuevoRepartidor = await Repartidor.create(repartidorData);
     console.log('Repartidor creado:', nuevoRepartidor);
     return nuevoRepartidor;
   } catch (error) {
     console.error('Error en repository al crear repartidor:', error);
     throw error;
   }
 }

 async findAll() {
   try {
     return await Repartidor.findAll({
       include: [{
         model: Usuario,
         attributes: ['nombre', 'email', 'telefono']
       }],
       where: {
         estado: 'activo'
       }
     });
   } catch (error) {
     console.error('Error en repository al buscar repartidores:', error);
     throw error;
   }
 }

 async findById(id) {
   try {
     return await Repartidor.findOne({ 
       where: { 
         id_repartidor: id,
         estado: 'activo'
       },
       include: [{
         model: Usuario,
         attributes: ['nombre', 'email', 'telefono']
       }]
     });
   } catch (error) {
     console.error('Error en repository al buscar repartidor:', error);
     throw error;
   }
 }

 async update(id, repartidorData) {
   try {
     const [updated] = await Repartidor.update(repartidorData, {
       where: { id_repartidor: id }
     });
     if (updated) {
       return await this.findById(id);
     }
     return null;
   } catch (error) {
     console.error('Error en repository al actualizar repartidor:', error);
     throw error;
   }
 }

 async softDelete(id) {
   try {
     return await Repartidor.update(
       { estado: 'inactivo' },
       { where: { id_repartidor: id } }
     );
   } catch (error) {
     console.error('Error en repository al desactivar repartidor:', error);
     throw error;
   }
 }

 async findByUserId(id_usuario) {
    try {
      return await Repartidor.findOne({ 
        where: { id_usuario },
        include: [{
          model: Usuario,
          attributes: ['nombre', 'email', 'telefono']
        }]
      });
    } catch (error) {
      console.error('Error en repository al buscar repartidor por id_usuario:', error);
      throw error;
    }
  }
  
}

module.exports = new RepartidorRepository();