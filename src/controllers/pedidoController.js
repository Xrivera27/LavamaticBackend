
const pedidoService = require('../services/pedidoService');
const emailService = require('../services/emailService');
const userService = require('../services/userService');
const repartidorService = require('../services/repartidorService');

class PedidoController {
  async getAll(req, res) {
    try {
      const { fechaInicio, fechaFin, estado } = req.query;
      const filtros = {};

      if (fechaInicio && fechaFin) {
        filtros.fechaInicio = new Date(fechaInicio);
        filtros.fechaFin = new Date(fechaFin);
      }

      if (estado) {
        filtros.estado = estado;
      }

      const pedidos = await pedidoService.getAllPedidos(filtros);
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  }

  async getPendientes(req, res) {
    try {
      const pedidos = await pedidoService.getPedidosPendientes();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener pedidos pendientes' });
    }
  }

  
async asignarRepartidor(req, res) {
  try {
    const { id_pedido } = req.params;
    const { id_repartidor } = req.body;

    if (!id_repartidor) {
      return res.status(400).json({ error: 'ID de repartidor requerido' });
    }

    // 1. Primero obtener el repartidor para conseguir su id_usuario
    const repartidorInfo = await repartidorService.getRepartidorById(id_repartidor);
    // Si estás usando el repositorio directamente:
    // const repartidorInfo = await repartidorRepository.findById(id_repartidor);
    
    if (!repartidorInfo) {
      return res.status(404).json({ error: 'Repartidor no encontrado' });
    }

    // 2. Asignar repartidor al pedido
    const pedido = await pedidoService.asignarRepartidor(id_pedido, id_repartidor);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado o no está en espera' });
    }

    // 3. Obtener información del cliente
    const cliente = await userService.getUserById(pedido.id_cliente);

    // 4. Obtener información del usuario asociado al repartidor
    const repartidorUser = await userService.getUserById(repartidorInfo.id_usuario);
    
    if (!repartidorUser) {
      // Continuar el proceso aunque no se encuentre el usuario del repartidor
      console.warn(`No se encontró usuario para el repartidor ${id_repartidor}`);
    }

    // 5. Obtener servicios del pedido
    const servicios = await pedidoService.getServiciosPedido(id_pedido);

    // 6. Preparar detalles para el correo
    const pedidoDetalles = {
      id: pedido.id_pedido,
      nombreRepartidor: repartidorUser ? repartidorUser.nombre : `Repartidor ${id_repartidor}`,
      telefonoRepartidor: repartidorUser ? repartidorUser.telefono : 'No disponible',
      servicios: servicios,
      direccionRecogida: pedido.direccion_recogida,
      direccionEntrega: pedido.direccion_entrega
    };

    // 7. Enviar correo de confirmación (en segundo plano)
    try {
      await emailService.sendRepartidorAsignado(cliente.email, pedidoDetalles);
    } catch (emailError) {
      console.error('Error al enviar correo de asignación de repartidor:', emailError);
    }

    res.json({ message: 'Repartidor asignado correctamente', pedido });
  } catch (error) {
    console.error('Error al asignar repartidor:', error);
    res.status(500).json({ error: 'Error al asignar repartidor' });
  }
}

async volverAEspera(req, res) {
  try {
    const { id_pedido } = req.params;
    const pedido = await pedidoService.volverAEspera(id_pedido);
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado o no tiene repartidor asignado' });
    }

    res.json({ message: 'Pedido vuelto a espera', pedido });
  } catch (error) {
    res.status(500).json({ error: 'Error al volver pedido a espera' });
  }
}

  async cambiarEstado(req, res) {
    try {
      const { id_pedido } = req.params;
      const { id_estado } = req.body;

      if (!id_estado) {
        return res.status(400).json({ error: 'Estado requerido' });
      }

      const pedido = await pedidoService.cambiarEstado(id_pedido, id_estado);
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      res.json({ message: 'Estado actualizado correctamente', pedido });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar estado' });
    }
  }
}

module.exports = new PedidoController();