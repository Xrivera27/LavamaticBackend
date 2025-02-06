
const equipoService = require('../services/equipoService');

class EquipoController {
  async getAll(req, res) {
    try {
      const equipos = await equipoService.getAllEquipos();
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener equipos' });
    }
  }

  async getById(req, res) {
    try {
      const equipo = await equipoService.getEquipoById(req.params.id);
      if (!equipo) {
        return res.status(404).json({ error: 'Equipo no encontrado' });
      }
      res.json(equipo);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener equipo' });
    }
  }

  async create(req, res) {
    try {
      const { nombre, descripcion, cantidad_total } = req.body;
      
      if (!nombre || !cantidad_total) {
        return res.status(400).json({ error: 'Nombre y cantidad total son requeridos' });
      }

      const equipo = await equipoService.createEquipo({
        nombre,
        descripcion,
        cantidad_total,
        cantidad_en_uso: 0,
        cantidad_mantenimiento: 0
      });

      res.status(201).json(equipo);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear equipo' });
    }
  }

  async update(req, res) {
    try {
      const { nombre, descripcion, cantidad_total } = req.body;
      const updated = await equipoService.updateEquipo(req.params.id, {
        nombre,
        descripcion,
        cantidad_total
      });

      if (!updated) {
        return res.status(404).json({ error: 'Equipo no encontrado' });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar equipo' });
    }
  }

  async remove(req, res) {
    try {
      const equipo = await equipoService.removeEquipo(req.params.id);
      if (!equipo) {
        return res.status(404).json({ error: 'Equipo no encontrado o sin unidades disponibles' });
      }
      res.json({ message: 'Equipo actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar equipo' });
    }
  }
}

module.exports = new EquipoController();