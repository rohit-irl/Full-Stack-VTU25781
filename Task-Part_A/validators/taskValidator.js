const { body, param } = require('express-validator');

const statuses = ['pending', 'in-progress', 'completed'];

exports.validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(statuses)
    .withMessage(`Status must be one of: ${statuses.join(', ')}`),
];

exports.validateTaskId = [
  param('id').isMongoId().withMessage('Valid task id is required'),
];
