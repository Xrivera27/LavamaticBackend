// src/controllers/servicioClienteController.js
const servicioClienteService = require('../services/servicioClienteService');
const pedidoClienteService = require('../services/pedidoClienteService');
const emailService = require('../services/emailService');
const userService = require('../services/userService');

class ServicioClienteController {
  /**
   * Obtener servicios disponibles
   * @route GET /api/servicios
   */
  async getServiciosDisponibles(req, res) {
    try {
      const servicios = await servicioClienteService.getServiciosDisponibles();
      res.json(servicios);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      res.status(500).json({ error: 'Error al obtener servicios disponibles' });
    }
  }

  /**
   * Obtener detalle de un servicio específico
   * @route GET /api/servicios/:id
   */
  async getServicioDetalle(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'ID de servicio es requerido' });
      }

      const servicio = await servicioClienteService.getServicioById(id);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      res.json(servicio);
    } catch (error) {
      console.error('Error al obtener detalle del servicio:', error);
      res.status(500).json({ error: 'Error al obtener detalle del servicio' });
    }
  }

  /**
   * Obtener horarios disponibles
   * @route GET /api/horarios
   */
  async getHorarios(req, res) {
    try {
      const horarios = await servicioClienteService.getHorariosDisponibles();
      res.json(horarios);
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      res.status(500).json({ error: 'Error al obtener horarios disponibles' });
    }
  }

  /**
   * Verificar disponibilidad de un equipo en una fecha y horario específicos
   * @route POST /api/disponibilidad
   */
  async verificarDisponibilidad(req, res) {
    try {
      const { id_servicio, fecha, id_horario } = req.body;
      
      // Validaciones
      if (!id_servicio || !fecha || !id_horario) {
        return res.status(400).json({ 
          error: 'id_servicio, fecha y id_horario son requeridos' 
        });
      }
  
      // Obtenemos el servicio para conseguir el id_equipo
      const servicio = await servicioClienteService.getServicioById(id_servicio);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      if (!servicio.id_equipo) {
        return res.status(400).json({ error: 'El servicio no tiene un equipo asignado' });
      }
  
      const disponibilidad = await servicioClienteService.verificarDisponibilidad(
        servicio.id_equipo,
        fecha,
        id_horario
      );
  
      res.json(disponibilidad);
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      res.status(500).json({ error: 'Error al verificar disponibilidad' });
    }
  }

  /**
   * Crear un nuevo pedido
   * @route POST /api/pedidos
   */
  async crearPedido(req, res) {
    try {
      const {
        servicios,
        fecha,
        id_horario, 
        direccion_recogida,
        direccion_entrega
      } = req.body;
   
      // Validaciones
      if (!servicios || servicios.length === 0) {
        return res.status(400).json({ error: 'Debe incluir al menos un servicio' });
      }
   
      // Validar que cada servicio tenga id_servicio y cantidad
      const serviciosValidos = servicios.every(
        servicio => servicio.id_servicio && servicio.cantidad > 0
      );
      if (!serviciosValidos) {
        return res.status(400).json({ error: 'Servicios inválidos' });
      }
   
      if (!fecha || !id_horario) {
        return res.status(400).json({ error: 'Fecha y horario son requeridos' });
      }
   
      if (!direccion_recogida || !direccion_entrega) {
        return res.status(400).json({ error: 'Direcciones son requeridas' });
      }
   
      // Obtener detalles de los servicios con sus nombres
      const serviciosConNombre = await Promise.all(
        servicios.map(async (servicio) => {
          const servicioDetalle = await servicioClienteService.getServicioById(servicio.id_servicio);
          return {
            id_servicio: servicio.id_servicio,
            nombre: servicioDetalle.nombre,
            cantidad: servicio.cantidad
          };
        })
      );

      // Crear el pedido
      const pedido = await pedidoClienteService.crearPedido({
        id_cliente: req.user.id,
        servicios,
        fecha,
        id_horario,
        direccion_recogida,
        direccion_entrega
      });
   
      // Obtener información del cliente para el correo
      const cliente = await userService.getUserById(req.user.id);

      // Obtener información del horario
      const horario = await servicioClienteService.getHorarioById(id_horario);
 
      // Preparar detalles para el correo
     // Preparar detalles para el correo
const pedidoDetalles = {
  id: pedido.id_pedido, // Cambio aquí para usar id_pedido
  nombreCliente: cliente.nombre,
  fecha: fecha,
  horario: `${horario.hora_inicio} - ${horario.hora_fin}`,
  servicios: serviciosConNombre,
  direccionRecogida: direccion_recogida,
  direccionEntrega: direccion_entrega
};
 
      // Enviar correo de confirmación (en segundo plano)
      try {
        await emailService.sendPedidoConfirmation(cliente.email, pedidoDetalles);
      } catch (emailError) {
        console.error('Error al enviar correo de confirmación de pedido:', emailError);
      }
   
      res.status(201).json({
        message: 'Pedido creado exitosamente',
        pedido
      });
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({ error: 'Error al crear pedido' });
    }
  }
  /**
   * Obtener historial de pedidos del cliente
   * @route GET /api/pedidos
   */
  async getHistorialPedidos(req, res) {
    try {
      const { estado } = req.query;
      const id_cliente = req.user.id;

      // Validar que el cliente exista
      const cliente = await userService.getUserById(id_cliente);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const pedidos = await servicioClienteService.getHistorialPedidos(id_cliente, estado);
      
      res.json(pedidos);
    } catch (error) {
      console.error('Error al obtener historial de pedidos:', error);
      res.status(500).json({ error: 'Error al obtener historial de pedidos' });
    }
  }

  /**
   * Obtener detalle de un pedido específico
   * @route GET /api/pedidos/:id
   */
  async getPedidoDetalle(req, res) {
    try {
      const { id } = req.params;
      const id_cliente = req.user.id;

      if (!id) {
        return res.status(400).json({ error: 'ID de pedido es requerido' });
      }

      const pedido = await pedidoClienteService.getPedidoById(id);
      
      // Verificar que el pedido pertenezca al cliente
      if (!pedido || pedido.id_cliente !== id_cliente) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      
      res.json(pedido);
    } catch (error) {
      console.error('Error al obtener detalle del pedido:', error);
      res.status(500).json({ error: 'Error al obtener detalle del pedido' });
    }
  }

  /**
   * Cancelar un pedido
   * @route PUT /api/pedidos/:id/cancelar
   */
  async cancelarPedido(req, res) {
    try {
      const { id } = req.params;
      const id_cliente = req.user.id;

      if (!id) {
        return res.status(400).json({ error: 'ID de pedido es requerido' });
      }

      const pedido = await pedidoClienteService.cancelarPedido(id, id_cliente);
      
      res.json({
        message: 'Pedido cancelado exitosamente',
        pedido
      });
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      
      if (error.message === 'No se puede cancelar') {
        return res.status(400).json({ error: 'No se puede cancelar este pedido' });
      }
      
      res.status(500).json({ error: 'Error al cancelar pedido' });
    }
  }
}

module.exports = new ServicioClienteController();