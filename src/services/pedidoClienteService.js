
const pedidoClienteRepository = require('../repositories/pedidoClienteRepository');
const servicioClienteService = require('./servicioClienteService');

class PedidoClienteService {
  async crearPedido(pedidoData) {
    const { servicios, ...datoPedido } = pedidoData;
    
    // Calcular subtotales y total
    let total = 0;
    const serviciosConSubtotal = await Promise.all(
      servicios.map(async (servicio) => {
        const servicioInfo = await servicioClienteService.getServicioById(servicio.id_servicio);
        const subtotal = servicioInfo.precio * servicio.cantidad;
        total += subtotal;
        return {
          ...servicio,
          subtotal
        };
      })
    );

    // Crear pedido con el total calculado
    return await pedidoClienteRepository.crearPedido(
      { ...datoPedido, total },
      serviciosConSubtotal
    );
  }
}

module.exports = new PedidoClienteService();