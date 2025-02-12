// src/controllers/repartidorController.js
const repartidorService = require('../services/repartidorServices');

class RepartidorController {
    async getPedidosAsignados(req, res) {
        try {
          const id_repartidor = req.user.id;
          console.log('ID del repartidor autenticado:', id_repartidor);
          
          const pedidos = await repartidorService.getPedidosAsignados(id_repartidor);
          console.log('Pedidos encontrados:', pedidos);
          
          if (pedidos.length === 0) {
            res.json({ message: 'No hay pedidos asignados', data: [] });
          } else {
            res.json(pedidos);
          }
        } catch (error) {
          console.error('Error al obtener pedidos:', error);
          res.status(500).json({ error: 'Error al obtener pedidos asignados' });
        }
      }

  async getPedidoDetalle(req, res) {
    try {
      const { id_pedido } = req.params;
      const pedido = await repartidorService.getPedidoDetalle(id_pedido);
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      res.json(pedido);
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      res.status(500).json({ error: 'Error al obtener detalle del pedido' });
    }
  }

  async actualizarEstadoPedido(req, res) {
    try {
      const { id_pedido } = req.params;
      const { nuevo_estado } = req.body;
      const id_repartidor = req.user.id;

      console.log('Actualizando pedido:', {
        id_pedido,
        nuevo_estado,
        id_repartidor
      });

      // Validar que el estado sea un número entre 1 y 3
      if (!Number.isInteger(nuevo_estado) || nuevo_estado < 1 || nuevo_estado > 3) {
        return res.status(400).json({ error: 'Estado no válido. Debe ser 1, 2 o 3' });
      }

      const pedido = await repartidorService.actualizarEstadoPedido(
        id_pedido,
        nuevo_estado,
        id_repartidor
      );

      res.json({
        message: 'Estado actualizado correctamente',
        pedido
      });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ error: 'Error al actualizar estado del pedido' });
    }
  }

  async getHistorialEntregas(req, res) {
    try {
      const id_repartidor = req.user.id;
      console.log('Buscando historial para repartidor:', id_repartidor);
      
      const pedidos = await repartidorService.getHistorialEntregas(id_repartidor);
      
      if (pedidos.length === 0) {
        res.json({ message: 'No hay entregas realizadas', data: [] });
      } else {
        res.json(pedidos);
      }
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({ error: 'Error al obtener historial de entregas' });
    }
  }

  
}

module.exports = new RepartidorController();