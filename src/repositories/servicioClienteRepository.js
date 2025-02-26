const Servicio = require('../models/Servicio');
const Horario = require('../models/Horario');
const ReservaEquipo = require('../models/reservaEquipo');
const Equipo = require('../models/equipos');
const { Op } = require('sequelize');
const Pedido = require('../models/pedidos');
const PedidoServicio = require('../models/pedidoServicio');
const Estado = require('../models/estados');

class ServicioClienteRepository {
 async findAllServicios() {
   return await Servicio.findAll({
     where: { activo: true },
     attributes: ['id_servicio', 'nombre', 'descripcion', 'precio', 'tiempo_estimado', 'categoria']
   });
 }

 async findServicioById(id) {
   return await Servicio.findOne({
     where: { 
       id_servicio: id,
       activo: true
     }
   });
 }

 // Nuevo método agregado
 async findHorarioById(id) {
   try {
     const horario = await Horario.findByPk(id);
     
     if (!horario) {
       throw new Error('Horario no encontrado');
     }
     
     return horario;
   } catch (error) {
     console.error('Error al obtener horario por ID:', error);
     throw error;
   }
 }

 async findAllHorarios() {
   return await Horario.findAll({
     order: [['hora_inicio', 'ASC']]
   });
 }

 async verificarDisponibilidadHorario(id_equipo, fecha, id_horario) {
   const equipo = await Equipo.findByPk(id_equipo);
   
   if (!equipo) {
     throw new Error('Equipo no encontrado');
   }

   const reservas = await ReservaEquipo.findAll({
     where: {
       id_equipo: id_equipo,
       fecha: fecha,
       id_horario: id_horario
     }
   });

   const capacidadUsada = reservas.reduce((sum, reserva) => sum + reserva.cantidad, 0);

   const disponible = capacidadUsada < equipo.cantidad_total;

   return {
     disponible,
     capacidadTotal: equipo.cantidad_total,
     capacidadUsada,
     capacidadDisponible: equipo.cantidad_total - capacidadUsada
   };
 }

 async obtenerDisponibilidadHorarios(fecha) {
   const horarios = await Horario.findAll({
     order: [['hora_inicio', 'ASC']]
   });

   const equipos = await Equipo.findAll();

   const disponibilidad = [];

   for (const horario of horarios) {
     const reservasPorHorario = await ReservaEquipo.findAll({
       where: {
         fecha: fecha,
         id_horario: horario.id_horario
       }
     });

     let horarioDisponible = false;
     for (const equipo of equipos) {
       const reservasEquipo = reservasPorHorario.filter(r => r.id_equipo === equipo.id_equipo);
       const capacidadUsada = reservasEquipo.reduce((sum, reserva) => sum + reserva.cantidad, 0);
       
       if (capacidadUsada < equipo.cantidad_total) {
         horarioDisponible = true;
         break;
       }
     }

     disponibilidad.push({
       id_horario: horario.id_horario,
       hora_inicio: horario.hora_inicio,
       hora_fin: horario.hora_fin,
       disponible: horarioDisponible
     });
   }

   return disponibilidad;
 }

 async findPedidosByCliente(id_cliente, estado) {
  const whereClause = {
    id_cliente
  };

  if (estado && estado !== 'todos') {
    whereClause.id_estado = estado;
  }

  return await Pedido.findAll({
    where: whereClause,
    include: [
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
    order: [['fecha_creacion', 'DESC']]
  });
 }
}

module.exports = new ServicioClienteRepository();