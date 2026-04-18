const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask, validateTaskId } = require('../validators/taskValidator');
const validateRequest = require('../middleware/validateMiddleware');

router.get('/', taskController.getTasks);
router.get('/:id', validateTaskId, validateRequest, taskController.getTaskById);
router.post('/', validateTask, validateRequest, taskController.createTask);
router.put('/:id', validateTaskId, validateTask, validateRequest, taskController.updateTask);
router.delete('/:id', validateTaskId, validateRequest, taskController.deleteTask);

module.exports = router;
