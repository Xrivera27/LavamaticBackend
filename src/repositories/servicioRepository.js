// src/repositories/servicioRepository.js
const Servicio = require('../models/servicios');
const Equipo = require('../models/equipos');

class ServicioRepository {
  async findAll() {
    return await Servicio.findAll({
      where: {
        activo: true
      },
      include: [
        {
          model: Equipo,
          as: 'equipo',
          attributes: ['id_equipo', 'nombre']
        }
      ]
    });
  }

  async findById(id) {
    return await Servicio.findOne({
      where: {
        id_servicio: id,
        activo: true
      },
      include: [
        {
          model: Equipo,
          as: 'equipo',
          attributes: ['id_equipo', 'nombre']
        }
      ]
    });
  }

  async create(servicioData) {
    return await Servicio.create({
      ...servicioData,
      activo: true
    });
  }

  async update(id, servicioData) {
    const servicio = await this.findById(id);
    if (servicio) {
      return await servicio.update(servicioData);
    }
    return null;
  }

  async softDelete(id) {
    const servicio = await this.findById(id);
    if (servicio) {
      return await servicio.update({ activo: false });
    }
    return false;
  }
}

module.exports = new ServicioRepository();