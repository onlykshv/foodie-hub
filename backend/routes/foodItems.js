const express = require('express');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');
const foodItemController = require('../controllers/foodItemController');

const router = express.Router();

// GET /api/food-items - public (available items only)
router.get('/', foodItemController.getFoodItems);

// GET /api/food-items/all - admin only (includes unavailable)
router.get('/all', authenticate, requireAdmin, foodItemController.getAllFoodItems);

// GET /api/food-items/:id - public
router.get('/:id', foodItemController.getFoodItem);

// POST /api/food-items - admin only
router.post('/', authenticate, requireAdmin, foodItemController.createFoodItem);

// PUT /api/food-items/:id - admin only
router.put('/:id', authenticate, requireAdmin, foodItemController.updateFoodItem);

// DELETE /api/food-items/:id - admin only
router.delete('/:id', authenticate, requireAdmin, foodItemController.deleteFoodItem);

module.exports = router;
