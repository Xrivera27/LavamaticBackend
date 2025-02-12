// src/controllers/servicioClienteController.js
const servicioClienteService = require('../services/servicioClienteService');
const pedidoClienteService = require('../services/pedidoClienteService');

class ServicioClienteController {
 async getServiciosDisponibles(req, res) {
   try {
     const servicios = await servicioClienteService.getServiciosDisponibles();
     res.json(servicios);
   } catch (error) {
     res.status(500).json({ error: 'Error al obtener servicios' });
   }
 }

 async getServicioDetalle(req, res) {
   try {
     const servicio = await servicioClienteService.getServicioById(req.params.id);
     if (!servicio) {
       return res.status(404).json({ error: 'Servicio no encontrado' });
     }
     res.json(servicio);
   } catch (error) {
     res.status(500).json({ error: 'Error al obtener detalle del servicio' });
   }
 }

 async getHorarios(req, res) {
   try {
     const horarios = await servicioClienteService.getHorariosDisponibles();
     res.json(horarios);
   } catch (error) {
     res.status(500).json({ error: 'Error al obtener horarios' });
   }
 }

 async verificarDisponibilidad(req, res) {
  try {
    const { id_equipo, fecha, id_horario } = req.body;
    
    if (!id_equipo || !fecha || !id_horario) {
      return res.status(400).json({ 
        error: 'id_equipo, fecha y id_horario son requeridos' 
      });
    }

    const disponibilidad = await servicioClienteService.verificarDisponibilidad(
      id_equipo,
      fecha,
      id_horario
    );

    res.json(disponibilidad);
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
}

 async crearPedido(req, res) {
  try {
    const {
      servicios,
      fecha,
      id_horario, 
      direccion_recogida,
      direccion_entrega
    } = req.body;
 
    console.log('Datos recibidos:', {
      servicios,
      fecha,
      id_horario,
      direccion_recogida,
      direccion_entrega
    });
 
    if (!servicios || servicios.length === 0) {
      console.log('Error: No hay servicios');
      return res.status(400).json({ error: 'Debe incluir al menos un servicio' });
    }
 
    if (!fecha || !id_horario) {
      console.log('Error: Falta fecha u horario');
      return res.status(400).json({ error: 'Fecha y horario son requeridos' });
    }
 
    if (!direccion_recogida || !direccion_entrega) {
      console.log('Error: Faltan direcciones');
      return res.status(400).json({ error: 'Direcciones son requeridas' });
    }
 
    console.log('ID del cliente:', req.user.id);
 
    const pedido = await pedidoClienteService.crearPedido({
      id_cliente: req.user.id,
      servicios,
      fecha,
      id_horario,
      direccion_recogida,
      direccion_entrega
    });
 
    console.log('Pedido creado:', pedido);
 
    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
 }

 
 async getHistorialPedidos(req, res) {
  try {
    console.log('Usuario:', req.user); // Para debug
    const { estado } = req.query;
    const id_cliente = req.user.id;

    const pedidos = await servicioClienteService.getHistorialPedidos(id_cliente, estado);
    console.log('Pedidos obtenidos:', pedidos); // Para debug
    res.json(pedidos);
  } catch (error) {
    console.error('Error específico:', error); // Para ver el error específico
    res.status(500).json({ error: 'Error al obtener historial de pedidos' });
  }
}
}

module.exports = new ServicioClienteController();