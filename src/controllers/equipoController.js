// src/controllers/equipoController.js
const equipoService = require('../services/equipoService');

class EquipoController {
  async getAll(req, res) {
    try {
      const equipos = await equipoService.getAllEquipos();
      res.json(equipos);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
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
      console.error('Error al obtener equipo:', error);
      res.status(500).json({ error: 'Error al obtener equipo' });
    }
  }

  async create(req, res) {
    try {
      const { nombre, descripcion, cantidad_total, cantidad_mantenimiento = 0 } = req.body;
      
      if (!nombre || !cantidad_total) {
        return res.status(400).json({ error: 'Nombre y cantidad total son requeridos' });
      }

      const equipo = await equipoService.createEquipo({
        nombre,
        descripcion,
        cantidad_total,
        cantidad_en_uso: 0,
        cantidad_mantenimiento
      });

      res.status(201).json(equipo);
    } catch (error) {
      console.error('Error al crear equipo:', error);
      res.status(500).json({ error: 'Error al crear equipo' });
    }
  }

  async update(req, res) {
    try {
      const { nombre, descripcion, cantidad_total, cantidad_mantenimiento } = req.body;
      const updated = await equipoService.updateEquipo(req.params.id, {
        nombre,
        descripcion,
        cantidad_total,
        cantidad_mantenimiento
      });

      if (!updated) {
        return res.status(404).json({ error: 'Equipo no encontrado' });
      }

      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar equipo:', error);
      res.status(500).json({ error: 'Error al actualizar equipo' });
    }
  }

  async remove(req, res) {
    try {
      // Obtenemos la cantidad de la consulta
      const cantidad = req.query.cantidad;
      
      // Llamamos al servicio con la cantidad especificada
      const equipo = await equipoService.removeEquipo(req.params.id, cantidad);
      
      if (!equipo) {
        return res.status(404).json({ 
          error: 'Equipo no encontrado o cantidad insuficiente para eliminar' 
        });
      }
      
      // Mensaje según el estado del equipo
      const mensaje = equipo.activo 
        ? `Se han eliminado ${cantidad || 1} unidades del equipo` 
        : 'El equipo ha sido marcado como inactivo';
        
      res.json({ 
        message: mensaje, 
        equipo 
      });
      
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      res.status(500).json({ error: 'Error al eliminar equipo' });
    }
  }
}

module.exports = new EquipoController();