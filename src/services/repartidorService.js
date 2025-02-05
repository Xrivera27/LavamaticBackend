
const repartidorRepository = require('../repositories/repartidorRepository');


class RepartidorService {
  async createRepartidor(data) {
    return await repartidorRepository.create(data);
  }

  async getAllRepartidores() {
    return await repartidorRepository.findAll();
  }

  async getRepartidorById(id) {
    return await repartidorRepository.findById(id);
  }

  async updateRepartidor(id, data) {
    return await repartidorRepository.update(id, data);
  }

  async deleteRepartidor(id) {
    return await repartidorRepository.softDelete(id);
  }

  async getRepartidorByUserId(id_usuario) {
    return await repartidorRepository.findByUserId(id_usuario);
  }
}

module.exports = new RepartidorService();