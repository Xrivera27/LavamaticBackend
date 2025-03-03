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
  
  async getPedidoById(id_pedido) {
    return await pedidoClienteRepository.findById(id_pedido);
  }
  
  async cancelarPedido(id_pedido, id_cliente) {
    // Verificar que el pedido exista y pertenezca al cliente
    const pedido = await this.getPedidoById(id_pedido);
    
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    
    if (pedido.id_cliente !== id_cliente) {
      throw new Error('Pedido no encontrado');
    }
    
    // Verificar que el pedido esté en un estado cancelable (solo "En Espera")
    if (pedido.id_estado !== 1) {
      throw new Error('No se puede cancelar');
    }
    
    // Marcar el pedido como inactivo
    return await pedidoClienteRepository.actualizarPedido(id_pedido, { 
      activo: false,
      fecha_actualizacion: new Date()
    });
  }
}

module.exports = new PedidoClienteService();