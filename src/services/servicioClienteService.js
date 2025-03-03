// src/services/servicioClienteService.js
const servicioClienteRepository = require('../repositories/servicioClienteRepository');
const Servicio = require('../models/servicios');
const Equipo = require('../models/equipos');

class ServicioClienteService {
  async getServiciosDisponibles() {
    try {
      // Obtenemos servicios activos incluyendo su equipo asociado
      return await servicioClienteRepository.findAllServicios();
    } catch (error) {
      console.error('Error al obtener servicios disponibles:', error);
      throw error;
    }
  }

  async getServicioById(id) {
    return await servicioClienteRepository.findServicioById(id);
  }

  async getHorarioById(id) {
    return await servicioClienteRepository.findHorarioById(id);
  }

  async getHorariosDisponibles() {
    return await servicioClienteRepository.findAllHorarios();
  }

  async verificarDisponibilidad(id_equipo, fecha, id_horario) {
    return await servicioClienteRepository.verificarDisponibilidad(id_equipo, fecha, id_horario);
  }

  async getHistorialPedidos(id_cliente, estado) {
    return await servicioClienteRepository.findPedidosByCliente(id_cliente, estado);
  }
}

module.exports = new ServicioClienteService();