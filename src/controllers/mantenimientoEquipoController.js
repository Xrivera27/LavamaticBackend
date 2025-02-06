
const mantenimientoEquipoService = require('../services/mantenimientoEquipoService');

class MantenimientoEquipoController {
  async getAll(req, res) {
    try {
      const mantenimientos = await mantenimientoEquipoService.getAllMantenimientos();
      res.json(mantenimientos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mantenimientos' });
    }
  }

  async getById(req, res) {
    try {
      const mantenimiento = await mantenimientoEquipoService.getMantenimientoById(req.params.id);
      if (!mantenimiento) {
        return res.status(404).json({ error: 'Mantenimiento no encontrado' });
      }
      res.json(mantenimiento);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mantenimiento' });
    }
  }

  async create(req, res) {
    try {
      const { id_equipo, fecha_fin, descripcion } = req.body;
      
      if (!id_equipo) {
        return res.status(400).json({ error: 'ID de equipo es requerido' });
      }

      const mantenimiento = await mantenimientoEquipoService.createMantenimiento({
        id_equipo,
        fecha_fin,
        descripcion
      });

      res.status(201).json(mantenimiento);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al crear mantenimiento' });
    }
  }

  async update(req, res) {
    try {
      const updated = await mantenimientoEquipoService.updateMantenimiento(
        req.params.id,
        req.body
      );

      if (!updated) {
        return res.status(404).json({ error: 'Mantenimiento no encontrado' });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar mantenimiento' });
    }
  }

  async delete(req, res) {
    try {
      const result = await mantenimientoEquipoService.deleteMantenimiento(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Mantenimiento no encontrado' });
      }
      res.json({ message: 'Mantenimiento finalizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al finalizar mantenimiento' });
    }
  }
}

module.exports = new MantenimientoEquipoController();