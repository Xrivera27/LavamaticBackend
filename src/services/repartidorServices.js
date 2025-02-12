const repartidorRepository = require('../repositories/repartidorRepositorys');

class RepartidorService {
  async getPedidosAsignados(id_repartidor) {
    return await repartidorRepository.findPedidosByRepartidor(id_repartidor);
  }

  async getPedidoDetalle(id_pedido) {
    return await repartidorRepository.findPedidoById(id_pedido);
  }

  async actualizarEstadoPedido(id_pedido, nuevo_estado, id_usuario) {
    // Validar que el estado sea un número válido
    if (![1, 2, 3].includes(nuevo_estado)) {
      throw new Error('Estado no válido');
    }

    return await repartidorRepository.actualizarEstadoPedido(
      id_pedido, 
      nuevo_estado, 
      id_usuario
    );
  }

  async getHistorialEntregas(id_usuario) {
    return await repartidorRepository.findPedidosEntregados(id_usuario);
  }
}

module.exports = new RepartidorService();