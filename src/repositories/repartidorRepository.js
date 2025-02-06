// src/repositories/repartidorRepository.js
const Usuario = require('../models/User');
const Repartidor = require('../models/repartidores');

class RepartidorRepository {
  async create(repartidorData) {
    return await Repartidor.create(repartidorData);
  }

  async findAll() {
    return await Repartidor.findAll({
      include: [{
        model: Usuario,
        as: 'user',
        attributes: ['id_usuario', 'nombre', 'email', 'telefono', 'direccion', 'activo']
      }],
      where: {
        estado: 'activo'
      }
    });
  }

  async findById(id) {
    return await Repartidor.findOne({ 
      where: { 
        id_repartidor: id,
        estado: 'activo'
      },
      include: [{
        model: Usuario,
        as: 'user',
        attributes: ['id_usuario', 'nombre', 'email', 'telefono', 'direccion', 'activo']
      }]
    });
  }

  async update(id, repartidorData) {
    const [updated] = await Repartidor.update(repartidorData, {
      where: { id_repartidor: id }
    });
    if (updated) {
      return await this.findById(id);
    }
    return null;
  }

  async softDelete(id) {
    return await Repartidor.update(
      { estado: 'inactivo' },
      { where: { id_repartidor: id } }
    );
  }

  async findByUserId(id_usuario) {
    return await Repartidor.findOne({ 
      where: { id_usuario },
      include: [{
        model: Usuario,
        as: 'user',
        attributes: ['id_usuario', 'nombre', 'email', 'telefono', 'direccion', 'activo']
      }]
    });
  }
}

module.exports = new RepartidorRepository();