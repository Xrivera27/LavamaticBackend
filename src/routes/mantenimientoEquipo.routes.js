
const express = require('express');
const router = express.Router();
const mantenimientoEquipoController = require('../controllers/mantenimientoEquipoController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware([1]));

router.get('/', mantenimientoEquipoController.getAll);
router.get('/:id', mantenimientoEquipoController.getById);
router.post('/', mantenimientoEquipoController.create);
router.put('/:id', mantenimientoEquipoController.update);
router.delete('/:id', mantenimientoEquipoController.delete);

module.exports = router;