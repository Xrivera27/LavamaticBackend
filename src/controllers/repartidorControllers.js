// src/controllers/repartidorController.js
const repartidorService = require('../services/repartidorServices');
const emailService = require('../services/emailService');
// Agregar estas importaciones faltantes
const userService = require('../services/userService');
const pedidoService = require('../services/pedidoService');

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
      
          // Obtener el pedido antes de actualizarlo para verificar si necesitamos enviar notificación
          const pedidoActual = await repartidorService.getPedidoDetalle(id_pedido);
          if (!pedidoActual) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
          }
      
          // Actualizar el estado del pedido
          const pedido = await repartidorService.actualizarEstadoPedido(
            id_pedido,
            nuevo_estado,
            id_repartidor
          );
      
          // Si el nuevo estado es "Entregado" (3), intentar enviar correo de agradecimiento
          let emailEnviado = false;
          let emailError = null;
          
          if (nuevo_estado === 3) {
            try {
              // Obtener información completa del pedido
              const pedidoCompleto = await repartidorService.getPedidoDetalle(id_pedido);
              
              // Registrar detalles del pedido para depuración
              console.log('Detalles del pedido para email:', {
                id_pedido: pedidoCompleto.id_pedido,
                id_cliente: pedidoCompleto.id_cliente,
                tiene_cliente: !!pedidoCompleto.cliente,
                cliente_email: pedidoCompleto.cliente ? pedidoCompleto.cliente.email : 'no disponible'
              });
              
              // Variables para almacenar la información del cliente para el correo
              let emailDestinatario = null;
              let nombreCliente = 'Estimado cliente';
              
              // Intentar obtener el email del cliente a través de diferentes caminos
              
              // Opción 1: Directamente del objeto cliente en el pedido
              if (pedidoCompleto.cliente && pedidoCompleto.cliente.email) {
                emailDestinatario = pedidoCompleto.cliente.email;
                nombreCliente = pedidoCompleto.cliente.nombre || nombreCliente;
                console.log('Email encontrado en objeto cliente:', emailDestinatario);
              } 
              // Opción 2: Buscar cliente por id_cliente
              else if (pedidoCompleto.id_cliente) {
                try {
                  console.log('Buscando cliente por id_cliente:', pedidoCompleto.id_cliente);
                  const clienteDirecto = await userService.getUserById(pedidoCompleto.id_cliente);
                  
                  if (clienteDirecto && clienteDirecto.email) {
                    emailDestinatario = clienteDirecto.email;
                    nombreCliente = clienteDirecto.nombre || nombreCliente;
                    console.log('Email encontrado en getUserById:', emailDestinatario);
                  }
                } catch (err) {
                  console.error('Error al buscar cliente alternativo:', err);
                }
              }
              
              // Opción 3: Si hay un correo en el pedido directamente (algunas implementaciones lo tienen)
              if (!emailDestinatario && pedidoCompleto.email) {
                emailDestinatario = pedidoCompleto.email;
                console.log('Email encontrado directamente en pedido:', emailDestinatario);
              }
              
              // Si después de todos los intentos no tenemos email, registrar el error
              if (!emailDestinatario) {
                console.warn(`No se pudo encontrar email para el cliente del pedido ${id_pedido}`);
                emailError = "No se encontró email para el cliente después de múltiples intentos";
              } else {
                // Obtener información del repartidor
                const repartidor = await userService.getUserById(id_repartidor);
                
                // Intentar obtener los servicios del pedido
                let servicios = [];
                try {
                  servicios = await pedidoService.getServiciosPedido(id_pedido);
                } catch (err) {
                  console.warn(`No se pudieron obtener los servicios del pedido ${id_pedido}:`, err);
                  // Si falla, intentar usar los servicios que podrían venir en el objeto pedido
                  if (pedidoCompleto.servicios && Array.isArray(pedidoCompleto.servicios)) {
                    servicios = pedidoCompleto.servicios;
                  }
                }
                
                // Preparar detalles para el correo
                const pedidoDetalles = {
                  id: id_pedido,
                  nombreCliente: nombreCliente,
                  nombreRepartidor: repartidor ? repartidor.nombre : 'Repartidor de Lavamatic',
                  servicios: servicios
                };
                
                // Enviar correo de confirmación de entrega
                await emailService.sendEntregaRepartidorConfirmacion(emailDestinatario, pedidoDetalles);
                console.log('Correo de confirmación enviado a:', emailDestinatario);
                emailEnviado = true;
              }
            } catch (error) {
              console.error('Error al enviar correo de confirmación de entrega:', error);
              emailError = error.message || "Error al enviar correo de confirmación";
            }
          }
      
          // Enviar respuesta con información sobre el estado del correo
          res.json({
            message: 'Estado actualizado correctamente',
            pedido,
            email: {
              enviado: emailEnviado,
              error: emailError
            }
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