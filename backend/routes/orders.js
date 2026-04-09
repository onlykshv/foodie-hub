const express = require('express');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');
const orderController = require('../controllers/orderController');

const router = express.Router();

// GET /api/orders - authenticated (user's orders, or all for admin)
router.get('/', authenticate, orderController.getOrders);

// GET /api/orders/:id - authenticated
router.get('/:id', authenticate, orderController.getOrder);

// POST /api/orders - authenticated
router.post('/', authenticate, orderController.createOrder);

// PATCH /api/orders/:id/status - admin only
router.patch('/:id/status', authenticate, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
