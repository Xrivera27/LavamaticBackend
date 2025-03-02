const { Op } = require('sequelize');
const Pedido = require('../models/pedidos');
const Usuario = require('../models/User');
const Estado = require('../models/estados');
const PedidoServicio = require('../models/pedidoServicio');
const Servicio = require('../models/Servicio');

class PedidoRepository {
  async findAll(filtros = {}) {
    const where = {};
    
    if (filtros.fechaInicio && filtros.fechaFin) {
      where.fecha_creacion = {
        [Op.between]: [filtros.fechaInicio, filtros.fechaFin]
      };
    }
    
    if (filtros.estado) {
      where.id_estado = filtros.estado;
    }

    return await Pedido.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'cliente',
          attributes: ['nombre', 'email', 'telefono']
        },
        {
          model: Usuario,
          as: 'repartidor',
          attributes: ['nombre', 'email', 'telefono']
        },
        {
          model: Estado,
          as: 'estado'
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });
  }

  async findById(id) {
    return await Pedido.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'cliente',
          attributes: ['nombre', 'email', 'telefono']
        },
        {
          model: Usuario,
          as: 'repartidor',
          attributes: ['nombre', 'email', 'telefono']
        },
        {
          model: Estado,
          as: 'estado'
        }
      ]
    });
  }

  async findPendientes() {
    return await Pedido.findAll({
      where: {
        id_estado: 1, // En espera
        id_repartidor: null
      },
      include: [
        {
          model: Usuario,
          as: 'cliente',
          attributes: ['nombre', 'email', 'telefono']
        },
        {
          model: Estado,
          as: 'estado'
        }
      ],
      order: [['fecha_creacion', 'ASC']]
    });
  }

  async asignarRepartidor(id_pedido, id_repartidor) {
    const pedido = await Pedido.findByPk(id_pedido);
    if (pedido && pedido.id_estado === 1) {
      return await pedido.update({
        id_repartidor,
        id_estado: 1, // En camino
        fecha_actualizacion: new Date()
      });
    }
    return null;
  }

  async volverAEspera(id_pedido) {
    const pedido = await Pedido.findByPk(id_pedido);
    // Verificar si el pedido existe y si está en un estado diferente a "En Espera"
    if (pedido && (pedido.id_repartidor !== null || pedido.id_estado !== 1)) {
      return await pedido.update({
        id_repartidor: null,
        id_estado: 1, // En espera
        fecha_actualizacion: new Date()
      });
    }
    return null;
  }

  async cambiarEstado(id_pedido, id_estado) {
    const pedido = await Pedido.findByPk(id_pedido);
    if (pedido) {
      return await pedido.update({
        id_estado,
        fecha_actualizacion: new Date()
      });
    }
    return null;
  }

  async findServiciosByPedido(id_pedido) {
    try {
      const pedidoServicios = await PedidoServicio.findAll({
        where: { id_pedido },
        include: [
          {
            model: Servicio,
            as: 'servicio',
            attributes: ['id_servicio', 'nombre', 'precio']
          }
        ]
      });

      // Transformar los resultados
      return pedidoServicios.map(ps => ({
        id_servicio: ps.servicio.id_servicio,
        nombre: ps.servicio.nombre,
        cantidad: ps.cantidad,
        precio: ps.servicio.precio
      }));
    } catch (error) {
      console.error('Error al buscar servicios del pedido:', error);
      throw error;
    }
  }
}

module.exports = new PedidoRepository();