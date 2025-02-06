
const servicioService = require('../services/servicioService');

class ServicioController {
  async getAll(req, res) {
    try {
      const servicios = await servicioService.getAllServicios();
      res.json(servicios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener servicios' });
    }
  }

  async getById(req, res) {
    try {
      const servicio = await servicioService.getServicioById(req.params.id);
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      res.json(servicio);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener servicio' });
    }
  }

  async create(req, res) {
    try {
      const { nombre, descripcion, precio, tiempo_estimado, categoria } = req.body;
      
      if (!nombre || !precio || !tiempo_estimado) {
        return res.status(400).json({ 
          error: 'Nombre, precio y tiempo estimado son requeridos' 
        });
      }

      const servicio = await servicioService.createServicio({
        nombre,
        descripcion,
        precio,
        tiempo_estimado,
        categoria
      });

      res.status(201).json(servicio);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear servicio' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const servicio = await servicioService.updateServicio(id, req.body);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      res.json(servicio);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar servicio' });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await servicioService.deleteServicio(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      res.json({ message: 'Servicio desactivado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al desactivar servicio' });
    }
  }
}

module.exports = new ServicioController();