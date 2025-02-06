
const MantenimientoEquipo = require('../models/mantenimientoEquipo');
const Equipo = require('../models/equipos');
const sequelize = require('../config/database');

class MantenimientoEquipoRepository {
  async findAll() {
    return await MantenimientoEquipo.findAll({
      where: { activo: true },
      include: [{
        model: Equipo,
        as: 'equipo',
        attributes: ['nombre', 'cantidad_total', 'cantidad_mantenimiento']
      }]
    });
  }

  async findById(id) {
    return await MantenimientoEquipo.findOne({
      where: { 
        id_mantenimiento: id,
        activo: true
      },
      include: [{
        model: Equipo,
        as: 'equipo'
      }]
    });
  }

  async create(mantenimientoData) {
    const t = await sequelize.transaction();
    try {
      const equipo = await Equipo.findByPk(mantenimientoData.id_equipo, { transaction: t });
      
      if (!equipo || equipo.cantidad_total <= 0) {
        throw new Error('Equipo no disponible');
      }

      await equipo.update({
        cantidad_total: equipo.cantidad_total - 1,
        cantidad_mantenimiento: equipo.cantidad_mantenimiento + 1
      }, { transaction: t });

      const mantenimiento = await MantenimientoEquipo.create({
        ...mantenimientoData,
        activo: true
      }, { transaction: t });

      await t.commit();
      return mantenimiento;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(id, mantenimientoData) {
    const mantenimiento = await this.findById(id);
    if (mantenimiento) {
      return await mantenimiento.update(mantenimientoData);
    }
    return null;
  }

  async softDelete(id) {
    const t = await sequelize.transaction();
    try {
      const mantenimiento = await this.findById(id);
      if (!mantenimiento) {
        throw new Error('Mantenimiento no encontrado');
      }

      const equipo = await Equipo.findByPk(mantenimiento.id_equipo, { transaction: t });
      
      await equipo.update({
        cantidad_total: equipo.cantidad_total + 1,
        cantidad_mantenimiento: equipo.cantidad_mantenimiento - 1
      }, { transaction: t });

      await mantenimiento.update({ activo: false }, { transaction: t });

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new MantenimientoEquipoRepository();