const sequelize = require('../config/database');
const Pedido = require('../models/pedidos');
const PedidoServicio = require('../models/pedidoServicio');
const Servicio = require('../models/Servicio');
const Estado = require('../models/estados');
const Repartidor = require('../models/repartidores');
const Usuario = require('../models/User');  // Asegúrate de importar el modelo de Usuario
const { Op } = require('sequelize');

class RepartidorRepository {
 async findPedidosByRepartidor(id_usuario) {
   console.log('ID del usuario:', id_usuario);
   
   // Primero obtener el id_repartidor
   const repartidor = await Repartidor.findOne({
     where: { id_usuario: id_usuario }
   });

   if (!repartidor) {
     console.log('No se encontró repartidor para el usuario:', id_usuario);
     return [];
   }

   console.log('ID del repartidor encontrado:', repartidor.id_repartidor);

   const pedidos = await Pedido.findAll({
     where: {
       id_repartidor: repartidor.id_repartidor
     },
     include: [
       {
         model: Usuario,  // Incluir modelo de Usuario
         as: 'cliente',   // Usar el alias definido en el modelo
         attributes: ['nombre']  // Solo traer el nombre del cliente
       },
       {
         model: Estado,
         as: 'estado',
         attributes: ['nombre_estado']
       },
       {
         model: PedidoServicio,
         as: 'servicios',
         include: [
           {
             model: Servicio,
             as: 'servicio',
             attributes: ['nombre', 'precio']
           }
         ]
       }
     ],
     order: [['fecha_creacion', 'DESC']]
   });

   return pedidos;
 }

 async findPedidoById(id_pedido) {
  return await Pedido.findOne({
    where: { id_pedido },
    include: [
      {
        model: Usuario,  // Incluir modelo de Usuario
        as: 'cliente',   
        attributes: ['nombre', 'telefono']  // Agregar atributos adicionales
      },
      {
        model: PedidoServicio,
        as: 'servicios',
        include: [
          {
            model: Servicio,
            as: 'servicio',
            attributes: ['nombre', 'precio']
          }
        ]
      },
      {
        model: Estado,
        as: 'estado',
        attributes: ['nombre_estado']
      }
    ]
  });
}

 async actualizarEstadoPedido(id_pedido, nuevo_estado, id_usuario) {
    try {
      // Primero obtener el id_repartidor del usuario
      const repartidor = await Repartidor.findOne({
        where: { id_usuario: id_usuario }
      });

      if (!repartidor) {
        throw new Error('Repartidor no encontrado');
      }

      // Buscar el pedido y actualizarlo
      const pedido = await Pedido.findOne({
        where: { 
          id_pedido: id_pedido
        }
      });

      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }

      // Actualizar el estado
      await pedido.update({
        id_estado: nuevo_estado,
        fecha_actualizacion: new Date()
      });

      return pedido;
    } catch (error) {
      throw error;
    }
  }

  async findPedidosEntregados(id_usuario) {
    // Primero obtener el id_repartidor del usuario
    const repartidor = await Repartidor.findOne({
      where: { id_usuario: id_usuario }
    });
  
    if (!repartidor) {
      console.log('No se encontró repartidor para el usuario:', id_usuario);
      return [];
    }
  
    console.log('Buscando pedidos entregados para repartidor:', repartidor.id_repartidor);
  
    // Buscar todos los pedidos entregados de este repartidor
    return await Pedido.findAll({
      where: {
        id_repartidor: repartidor.id_repartidor,
        id_estado: 3  // Estado entregado
      },
      include: [
        {
          model: Usuario,  // Incluir modelo de Usuario
          as: 'cliente',   // Usar el alias definido en el modelo
          attributes: ['nombre']  // Solo traer el nombre del cliente
        },
        {
          model: PedidoServicio,
          as: 'servicios',
          include: [
            {
              model: Servicio,
              as: 'servicio',
              attributes: ['nombre', 'precio']
            }
          ]
        },
        {
          model: Estado,
          as: 'estado',
          attributes: ['nombre_estado']
        }
      ],
      order: [['fecha_actualizacion', 'DESC']]
    });
  }
}

module.exports = new RepartidorRepository();