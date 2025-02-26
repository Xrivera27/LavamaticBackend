const servicioClienteRepository = require('../repositories/servicioClienteRepository');

class ServicioClienteService {
  async getServiciosDisponibles() {
    return await servicioClienteRepository.findAllServicios();
  }

  async getServicioById(id) {
    return await servicioClienteRepository.findServicioById(id);
  }

  // Nuevo método
  async getHorarioById(id) {
    return await servicioClienteRepository.findHorarioById(id);
  }

  async getHorariosDisponibles() {
    return await servicioClienteRepository.findAllHorarios();
  }

  async verificarDisponibilidad(id_equipo, fecha, id_horario) {
    return await servicioClienteRepository.verificarDisponibilidadHorario(
      id_equipo,
      fecha,
      id_horario
    );
  }

  async getHistorialPedidos(id_cliente, estado) {
    return await servicioClienteRepository.findPedidosByCliente(id_cliente, estado);
  }
}

module.exports = new ServicioClienteService();