const servicioService = require('../services/servicioService');

class ServicioController {
  async getAll(req, res) {
    try {
      const servicios = await servicioService.getAllServicios();
      res.json(servicios);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
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
      console.error("Error al obtener servicio:", error);
      res.status(500).json({ error: 'Error al obtener servicio' });
    }
  }

  async create(req, res) {
    try {
      // Agregar id_equipo a la desestructuración
      const { nombre, descripcion, precio, tiempo_estimado, categoria, id_equipo } = req.body;
      
      console.log("Datos recibidos para crear servicio:", req.body);
      
      if (!nombre || !precio || !tiempo_estimado) {
        return res.status(400).json({ 
          error: 'Nombre, precio y tiempo estimado son requeridos' 
        });
      }

      // Validar id_equipo (opcional: podría ser obligatorio si lo prefieres)
      if (!id_equipo) {
        return res.status(400).json({ 
          error: 'Se requiere seleccionar un equipo' 
        });
      }

      const servicio = await servicioService.createServicio({
        nombre,
        descripcion,
        precio,
        tiempo_estimado,
        categoria,
        id_equipo: parseInt(id_equipo) // Convertir a número si viene como string
      });

      res.status(201).json(servicio);
    } catch (error) {
      console.error("Error al crear servicio:", error);
      res.status(500).json({ error: 'Error al crear servicio' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      
      // Convertir id_equipo a número si existe
      if (req.body.id_equipo) {
        req.body.id_equipo = parseInt(req.body.id_equipo);
      }
      
      console.log("Datos para actualizar servicio:", req.body);
      
      const servicio = await servicioService.updateServicio(id, req.body);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      res.json(servicio);
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
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
      console.error("Error al desactivar servicio:", error);
      res.status(500).json({ error: 'Error al desactivar servicio' });
    }
  }
}

module.exports = new ServicioController();