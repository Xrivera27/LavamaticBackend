
const pedidoService = require('../services/pedidoService');

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

      const pedido = await pedidoService.asignarRepartidor(id_pedido, id_repartidor);
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado o no está en espera' });
      }

      res.json({ message: 'Repartidor asignado correctamente', pedido });
    } catch (error) {
      res.status(500).json({ error: 'Error al asignar repartidor' });
    }
  }

  async volverAEspera(req, res) {
    try {
      const { id_pedido } = req.params;
      const pedido = await pedidoService.volverAEspera(id_pedido);
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado o no está en camino' });
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