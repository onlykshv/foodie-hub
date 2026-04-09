const FoodItem = require('../models/FoodItem');

// GET /api/food-items (available items only)
exports.getFoodItems = async (req, res) => {
  try {
    const filter = { is_available: true };

    // Optional category filter
    if (req.query.category_id) {
      filter.category_id = req.query.category_id;
    }

    const items = await FoodItem.find(filter)
      .populate('category_id')
      .sort({ name: 1 });

    res.json(items);
  } catch (error) {
    console.error('Get food items error:', error);
    res.status(500).json({ error: 'Failed to fetch food items.' });
  }
};

// GET /api/food-items/all (admin - all items including unavailable)
exports.getAllFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find()
      .populate('category_id')
      .sort({ name: 1 });

    res.json(items);
  } catch (error) {
    console.error('Get all food items error:', error);
    res.status(500).json({ error: 'Failed to fetch food items.' });
  }
};

// GET /api/food-items/:id
exports.getFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id).populate('category_id');

    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get food item error:', error);
    res.status(500).json({ error: 'Failed to fetch food item.' });
  }
};

// POST /api/food-items (Admin only)
exports.createFoodItem = async (req, res) => {
  try {
    const { name, description, price, image_url, category_id, is_available, preparation_time } = req.body;

    const item = await FoodItem.create({
      name,
      description,
      price,
      image_url,
      category_id: category_id || null,
      is_available: is_available !== undefined ? is_available : true,
      preparation_time: preparation_time || 15,
    });

    // Populate category for response
    await item.populate('category_id');

    res.status(201).json(item);
  } catch (error) {
    console.error('Create food item error:', error);
    res.status(500).json({ error: 'Failed to create food item.' });
  }
};

// PUT /api/food-items/:id (Admin only)
exports.updateFoodItem = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'description', 'price', 'image_url', 'category_id', 'is_available', 'preparation_time'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const item = await FoodItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category_id');

    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    res.json(item);
  } catch (error) {
    console.error('Update food item error:', error);
    res.status(500).json({ error: 'Failed to update food item.' });
  }
};

// DELETE /api/food-items/:id (Admin only)
exports.deleteFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete food item error:', error);
    res.status(500).json({ error: 'Failed to delete food item.' });
  }
};
