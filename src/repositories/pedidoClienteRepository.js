const sequelize = require('../config/database');
const { Op } = require('sequelize');
const Pedido = require('../models/pedidos');
const PedidoServicio = require('../models/pedidoServicio');
const PedidoEquipo = require('../models/pedidoEquipo');
const Equipo = require('../models/equipos');
const ReservaEquipo = require('../models/reservaEquipo');
const Pago = require('../models/pago');
const Servicio = require('../models/servicio');

class PedidoClienteRepository {
 async crearPedido(pedidoData, servicios) {
   const t = await sequelize.transaction();
   try {
     const serviciosInfo = await Promise.all(
       servicios.map(async (servicio) => {
         const servicioData = await Servicio.findByPk(servicio.id_servicio);
         const subtotal = servicioData.precio * servicio.cantidad;
         return {
           ...servicio,
           subtotal
         };
       })
     );

     const total = serviciosInfo.reduce((sum, servicio) => sum + servicio.subtotal, 0);

     const pedido = await Pedido.create({
       ...pedidoData,
       total,
       id_estado: 1,
       fecha_creacion: new Date(),
       fecha_actualizacion: new Date()
     }, { transaction: t });

     const pedidoServicios = serviciosInfo.map(servicio => ({
       id_pedido: pedido.id_pedido,
       id_servicio: servicio.id_servicio,
       cantidad: servicio.cantidad,
       subtotal: servicio.subtotal
     }));

     await PedidoServicio.bulkCreate(pedidoServicios, { transaction: t });

     const equipoDisponible = await Equipo.findOne({
       transaction: t
     });

     if (!equipoDisponible) {
       throw new Error('No hay equipos disponibles');
     }

     // Verificar disponibilidad para el horario específico
     const reservasExistentes = await ReservaEquipo.findAll({
       where: {
         id_equipo: equipoDisponible.id_equipo,
         fecha: pedidoData.fecha,
         id_horario: pedidoData.id_horario
       },
       transaction: t
     });

     const capacidadUsadaEnHorario = reservasExistentes.reduce((sum, reserva) => sum + reserva.cantidad, 0);
     const capacidadTotal = equipoDisponible.cantidad_total;

     if (capacidadUsadaEnHorario + 1 > capacidadTotal) {
       throw new Error('No hay capacidad disponible para este horario');
     }

     const reservaExistente = await ReservaEquipo.findOne({
       where: {
         id_equipo: equipoDisponible.id_equipo,
         fecha: pedidoData.fecha,
         id_horario: pedidoData.id_horario
       },
       transaction: t
     });

     if (reservaExistente) {
       await reservaExistente.update({
         cantidad: reservaExistente.cantidad + 1
       }, { transaction: t });
     } else {
       await ReservaEquipo.create({
         id_pedido: pedido.id_pedido,
         id_equipo: equipoDisponible.id_equipo,
         id_horario: pedidoData.id_horario,
         fecha: pedidoData.fecha,
         cantidad: 1
       }, { transaction: t });
     }

     await PedidoEquipo.create({
       id_pedido: pedido.id_pedido,
       id_equipo: equipoDisponible.id_equipo,
       cantidad: 1
     }, { transaction: t });

     await Pago.create({
       id_pedido: pedido.id_pedido,
       monto: pedido.total,
       metodo_pago: 'efectivo',
       estado: 'pendiente',
       fecha_pago: new Date()
     }, { transaction: t });

     await t.commit();
     return pedido;
   } catch (error) {
     if (t) await t.rollback();
     throw error;
   }
 }

 async findAll() {
   return await Pedido.findAll({
     include: [
       {
         model: PedidoServicio,
         as: 'servicios'
       },
       {
         model: PedidoEquipo,
         as: 'equipos'
       },
       {
         model: ReservaEquipo,
         as: 'reservas'
       }
     ]
   });
 }

 async findById(id) {
   return await Pedido.findOne({
     where: { id_pedido: id },
     include: [
       {
         model: PedidoServicio,
         as: 'servicios'
       },
       {
         model: PedidoEquipo,
         as: 'equipos'
       },
       {
         model: ReservaEquipo,
         as: 'reservas'
       }
     ]
   });
 }

 async verificarDisponibilidad(fecha, id_horario) {
   const equipos = await Equipo.findAll();

   if (equipos.length === 0) {
     return false;
   }

   // Verificar disponibilidad por horario
   for (const equipo of equipos) {
     const reservas = await ReservaEquipo.findAll({
       where: {
         id_equipo: equipo.id_equipo,
         fecha: fecha,
         id_horario: id_horario
       }
     });

     const capacidadUsada = reservas.reduce((sum, reserva) => sum + reserva.cantidad, 0);
     if (capacidadUsada < equipo.cantidad_total) {
       return true;
     }
   }

   return false;
 }
 async actualizarPedido(id_pedido, datos) {
  try {
    const pedido = await Pedido.findByPk(id_pedido);
    
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    
    await pedido.update(datos);
    
    // Devolver el pedido actualizado
    return await this.findById(id_pedido);
  } catch (error) {
    throw error;
  }
}
}

module.exports = new PedidoClienteRepository();