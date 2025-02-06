
const mantenimientoEquipoRepository = require('../repositories/mantenimientoEquipoRepository');

class MantenimientoEquipoService {
  async getAllMantenimientos() {
    return await mantenimientoEquipoRepository.findAll();
  }

  async getMantenimientoById(id) {
    return await mantenimientoEquipoRepository.findById(id);
  }

  async createMantenimiento(data) {
    return await mantenimientoEquipoRepository.create(data);
  }

  async updateMantenimiento(id, data) {
    return await mantenimientoEquipoRepository.update(id, data);
  }

  async deleteMantenimiento(id) {
    return await mantenimientoEquipoRepository.softDelete(id);
  }
}

module.exports = new MantenimientoEquipoService();