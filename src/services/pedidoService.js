const pedidoRepository = require('../repositories/pedidoRepository');

class PedidoService {
  async getAllPedidos(filtros) {
    return await pedidoRepository.findAll(filtros);
  }

  async getPedidoById(id) {
    return await pedidoRepository.findById(id);
  }

  async getPedidosPendientes() {
    return await pedidoRepository.findPendientes();
  }

  async asignarRepartidor(id_pedido, id_repartidor) {
    return await pedidoRepository.asignarRepartidor(id_pedido, id_repartidor);
  }

  async volverAEspera(id_pedido) {
    return await pedidoRepository.volverAEspera(id_pedido);
  }

  async cambiarEstado(id_pedido, id_estado) {
    return await pedidoRepository.cambiarEstado(id_pedido, id_estado);
  }

  // Nuevo método
  async getServiciosPedido(id_pedido) {
    try {
      return await pedidoRepository.findServiciosByPedido(id_pedido);
    } catch (error) {
      console.error('Error al obtener servicios del pedido:', error);
      throw error;
    }
  }
}

module.exports = new PedidoService();