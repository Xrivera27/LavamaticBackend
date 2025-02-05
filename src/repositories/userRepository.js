
const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    return await User.update(userData, {
      where: { id_usuario: id }
    });
  }
  
  async softDelete(id) {
    return await User.update(
      { activo: false },
      { where: { id_usuario: id } }
    );
  }
  
}



module.exports = new UserRepository();