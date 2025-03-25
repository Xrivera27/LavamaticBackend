// src/services/equipoService.js
const equipoRepository = require('../repositories/equipoRepository');
const pedidoRepository = require('../repositories/pedidoRepository'); // Importamos el repositorio de pedidos

class EquipoService {
  async getAllEquipos() {
    return await equipoRepository.findAll();
  }

  async getEquipoById(id) {
    return await equipoRepository.findById(id);
  }

  async createEquipo(equipoData) {
    return await equipoRepository.create(equipoData);
  }

  async updateEquipo(id, equipoData) {
    return await equipoRepository.update(id, equipoData);
  }

  async removeEquipo(id, cantidad) {
    // Verificar si el equipo existe
    const equipo = await equipoRepository.findById(id);
    if (!equipo) {
      throw new Error('Equipo no encontrado');
    }
    
    // Convertir la cantidad a un número entero
    const cantidadToRemove = cantidad && !isNaN(parseInt(cantidad)) ? parseInt(cantidad) : 1;
    
    // Verificar si hay suficientes unidades para eliminar
    if (equipo.cantidad_total < cantidadToRemove) {
      throw new Error(`No se pueden eliminar ${cantidadToRemove} unidades. Solo hay ${equipo.cantidad_total} disponibles.`);
    }
    
    // Si vamos a eliminar todas las unidades del equipo
    if (equipo.cantidad_total === cantidadToRemove) {
      // Verificar si hay pedidos activos que usan este equipo
      const pedidosActivos = await pedidoRepository.findActivosByEquipoId(id);
      
      if (pedidosActivos && pedidosActivos.length > 0) {
        // Crear mensaje detallado con información sobre los pedidos
        let mensaje = `No se puede eliminar completamente el equipo "${equipo.nombre}" porque está siendo utilizado en ${pedidosActivos.length} pedido(s) activo(s):\n\n`;
        
        // Añadir detalles de cada pedido
        pedidosActivos.forEach((pedido) => {
          const estadoNombre = pedido.estado ? pedido.estado.nombre : 'Estado desconocido';
          const clienteNombre = pedido.cliente ? pedido.cliente.nombre : 'Cliente desconocido';
          
          mensaje += `- Pedido #${pedido.id_pedido} (${estadoNombre}) - Cliente: ${clienteNombre}\n`;
        });
        
        mensaje += "\nPrimero debes completar estos pedidos o reducir la cantidad a eliminar.";
        
        throw new Error(mensaje);
      }
      
      // Si no hay pedidos activos, eliminar completamente
      return await equipoRepository.deleteComplete(id);
    }
    
    // Si solo eliminamos algunas unidades
    return await equipoRepository.decrementTotal(id, cantidadToRemove);
  }
  
  async deleteEquipoComplete(id) {
    // Verificar si el equipo existe
    const equipo = await equipoRepository.findById(id);
    if (!equipo) {
      throw new Error('Equipo no encontrado');
    }
    
    // Verificar si hay pedidos activos que usan este equipo
    const pedidosActivos = await pedidoRepository.findActivosByEquipoId(id);
    
    if (pedidosActivos && pedidosActivos.length > 0) {
      // Crear mensaje detallado con información sobre los pedidos
      let mensaje = `No se puede eliminar completamente el equipo "${equipo.nombre}" porque está siendo utilizado en ${pedidosActivos.length} pedido(s) activo(s):\n\n`;
      
      // Añadir detalles de cada pedido
      pedidosActivos.forEach((pedido) => {
        const estadoNombre = pedido.estado ? pedido.estado.nombre : 'Estado desconocido';
        const clienteNombre = pedido.cliente ? pedido.cliente.nombre : 'Cliente desconocido';
        
        mensaje += `- Pedido #${pedido.id_pedido} (${estadoNombre}) - Cliente: ${clienteNombre}\n`;
      });
      
      mensaje += "\nPrimero debes completar estos pedidos.";
      
      throw new Error(mensaje);
    }
    
    // Si no hay pedidos activos, eliminar completamente
    return await equipoRepository.deleteComplete(id);
  }
}

module.exports = new EquipoService();