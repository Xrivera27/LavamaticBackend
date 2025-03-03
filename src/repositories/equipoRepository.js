// src/repositories/equipoRepository.js
const Equipo = require('../models/equipos');

class EquipoRepository {
  async findAll() {
    return await Equipo.findAll({
      where: {
        activo: true // Solo traer los equipos activos
      }
    });
  }

  async findById(id) {
    return await Equipo.findOne({
      where: {
        id_equipo: id,
        activo: true
      }
    });
  }

  async create(equipoData) {
    return await Equipo.create({
      ...equipoData,
      activo: true
    });
  }

  async update(id, equipoData) {
    const equipo = await this.findById(id);
    if (equipo) {
      return await equipo.update(equipoData);
    }
    return null;
  }

  async decrementTotal(id, cantidad = 1) {
    const equipo = await this.findById(id);
    
    if (!equipo || equipo.cantidad_total < cantidad) {
      return null;
    }
    
    // Si la cantidad a eliminar es igual al total, marcamos como inactivo
    if (equipo.cantidad_total === cantidad) {
      return await equipo.update({
        activo: false
      });
    }
    
    // Si no, solo reducimos la cantidad
    return await equipo.update({
      cantidad_total: equipo.cantidad_total - cantidad
    });
  }
  
  async deleteComplete(id) {
    const equipo = await this.findById(id);
    if (equipo) {
      return await equipo.update({
        activo: false
      });
    }
    return null;
  }
}

module.exports = new EquipoRepository();