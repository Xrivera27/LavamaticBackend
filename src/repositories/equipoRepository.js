// src/repositories/equipoRepository.js
const Equipo = require('../models/equipos');

class EquipoRepository {
  async findAll() {
    return await Equipo.findAll();
  }

  async findById(id) {
    return await Equipo.findByPk(id);
  }

  async create(equipoData) {
    return await Equipo.create(equipoData);
  }

  async update(id, equipoData) {
    const equipo = await Equipo.findByPk(id);
    if (equipo) {
      return await equipo.update(equipoData);
    }
    return null;
  }

  async decrementTotal(id) {
    const equipo = await Equipo.findByPk(id);
    if (equipo && equipo.cantidad_total > 0) {
      return await equipo.update({
        cantidad_total: equipo.cantidad_total - 1
      });
    }
    return null;
  }
}

module.exports = new EquipoRepository();