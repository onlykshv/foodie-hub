const express = require('express');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// GET /api/categories - public
router.get('/', categoryController.getCategories);

// POST /api/categories - admin only
router.post('/', authenticate, requireAdmin, categoryController.createCategory);

// PUT /api/categories/:id - admin only
router.put('/:id', authenticate, requireAdmin, categoryController.updateCategory);

// DELETE /api/categories/:id - admin only
router.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory);

module.exports = router;
