
const configUsuarioRepository = require('../repositories/configUsuarioRepository');

class ConfigUsuarioService {
  async getUserById(id) {
    return await configUsuarioRepository.findById(id);
  }

  async getUserByEmail(email) {
    return await configUsuarioRepository.findByEmail(email);
  }

  async updateUser(id, userData) {
    return await configUsuarioRepository.update(id, userData);
  }

  async softDelete(id) {
    return await configUsuarioRepository.softDelete(id);
  }
}

module.exports = new ConfigUsuarioService();