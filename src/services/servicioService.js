
const servicioRepository = require('../repositories/servicioRepository');

class ServicioService {
  async getAllServicios() {
    return await servicioRepository.findAll();
  }

  async getServicioById(id) {
    return await servicioRepository.findById(id);
  }

  async createServicio(servicioData) {
    return await servicioRepository.create(servicioData);
  }

  async updateServicio(id, servicioData) {
    return await servicioRepository.update(id, servicioData);
  }

  async deleteServicio(id) {
    return await servicioRepository.softDelete(id);
  }
}

module.exports = new ServicioService();