const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const FoodItem = require('../models/FoodItem');
const { canTransition } = require('../utils/statusTransitions');

// GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    let filter = {};

    // If not admin, only return user's own orders
    if (req.user.role !== 'admin') {
      filter.user_id = req.user.id;
    }

    const orders = await Order.find(filter)
      .populate('user_id')
      .sort({ createdAt: -1 });

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id });
        const orderObj = order.toJSON();
        orderObj.items = items.map((item) => item.toJSON());
        // Map timestamps to match frontend format
        orderObj.created_at = order.createdAt?.toISOString();
        orderObj.updated_at = order.updatedAt?.toISOString();
        return orderObj;
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user_id');

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && order.user_id._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const items = await OrderItem.find({ order_id: order._id });
    const orderObj = order.toJSON();
    orderObj.items = items.map((item) => item.toJSON());
    orderObj.created_at = order.createdAt?.toISOString();
    orderObj.updated_at = order.updatedAt?.toISOString();

    res.json(orderObj);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, delivery_address, phone, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item.' });
    }

    // Fetch food items and calculate total
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const foodItem = await FoodItem.findById(item.food_item_id);
      if (!foodItem) {
        return res.status(400).json({ error: `Food item ${item.food_item_id} not found.` });
      }

      const subtotal = foodItem.price * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        food_item_id: foodItem._id,
        food_item_name: foodItem.name,
        quantity: item.quantity,
        unit_price: foodItem.price,
        subtotal,
      });
    }

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      status: 'placed',
      total_amount: totalAmount,
      delivery_address,
      phone,
      notes: notes || null,
    });

    // Create order items
    const orderItems = await OrderItem.insertMany(
      orderItemsData.map((item) => ({
        ...item,
        order_id: order._id,
      }))
    );

    // Build response
    const orderObj = order.toJSON();
    orderObj.items = orderItems.map((item) => item.toJSON());
    orderObj.created_at = order.createdAt?.toISOString();
    orderObj.updated_at = order.updatedAt?.toISOString();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('new-order', orderObj);
    }

    res.status(201).json(orderObj);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
};

// PATCH /api/orders/:id/status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Validate status transition
    if (!canTransition(order.status, status)) {
      return res.status(400).json({
        error: `Invalid status transition from '${order.status}' to '${status}'.`,
      });
    }

    order.status = status;
    await order.save();

    // Fetch items for the response
    const items = await OrderItem.find({ order_id: order._id });
    const orderObj = order.toJSON();
    orderObj.items = items.map((item) => item.toJSON());
    orderObj.created_at = order.createdAt?.toISOString();
    orderObj.updated_at = order.updatedAt?.toISOString();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('order-updated', orderObj);
      io.to(`customer-${order.user_id}`).emit('order-updated', orderObj);
    }

    res.json(orderObj);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};
