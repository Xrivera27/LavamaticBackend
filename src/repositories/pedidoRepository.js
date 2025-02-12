
const { Op } = require('sequelize');
const Pedido = require('../models/pedidos');
const Usuario = require('../models/User');
const Estado = require('../models/estados');

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
    if (pedido && pedido.id_estado === 2) {
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
}

module.exports = new PedidoRepository();