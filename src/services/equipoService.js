
const equipoRepository = require('../repositories/equipoRepository');

class EquipoService {
  async getAllEquipos() {
    return await equipoRepository.findAll();
  }

  async getEquipoById(id) {
    return await equipoRepository.findById(id);
  }

  async createEquipo(equipoData) {
    return await equipoRepository.create(equipoData);
  }

  async updateEquipo(id, equipoData) {
    return await equipoRepository.update(id, equipoData);
  }

  async removeEquipo(id) {
    return await equipoRepository.decrementTotal(id);
  }
}

module.exports = new EquipoService();