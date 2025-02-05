
const ConfigUsuario = require('../models/ConfigUsuario.js');

class ConfigUsuarioRepository {
  async findById(id) {
    return await ConfigUsuario.findOne({ 
      where: { id_usuario: id }
    });
  }

  async findByEmail(email) {
    return await ConfigUsuario.findOne({ 
      where: { email } 
    });
  }

  async update(id, userData) {
    return await ConfigUsuario.update(userData, {
      where: { id_usuario: id }
    });
  }

  async softDelete(id) {
    return await ConfigUsuario.update(
      { activo: false },
      { where: { id_usuario: id } }
    );
  }
}

module.exports = new ConfigUsuarioRepository();