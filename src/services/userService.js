// src/services/userService.js
const userRepository = require('../repositories/userRepository');

class UserService {
  async getUserByEmail(email) {
    return await userRepository.findByEmail(email);
  }

  async createUser(userData) {
    return await userRepository.create(userData);
  }

  async updateUser(id, userData) {
    return await userRepository.update(id, userData);
  }
  
  async softDeleteUser(id) {
    return await userRepository.softDelete(id);
  }

  async softDelete(id) {
    return await userRepository.softDelete(id);
  }

  async getAllClients() {
    return await userRepository.findAllClients();
  }
  
}

module.exports = new UserService();