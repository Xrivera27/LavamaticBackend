const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/register', clientController.register);
router.put('/:id', clientController.update);
router.delete('/:id', clientController.delete);

module.exports = router;