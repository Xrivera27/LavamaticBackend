// src/services/equipoService.js
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

  async removeEquipo(id, cantidad) {
    // Si la cantidad no se especifica o es inválida, usamos 1 como valor predeterminado
    const cantidadToRemove = cantidad && !isNaN(parseInt(cantidad)) ? parseInt(cantidad) : 1;
    
    return await equipoRepository.decrementTotal(id, cantidadToRemove);
  }
  
  async deleteEquipoComplete(id) {
    return await equipoRepository.deleteComplete(id);
  }
}

module.exports = new EquipoService();