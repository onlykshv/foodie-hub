const FoodCategory = require('../models/FoodCategory');

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await FoodCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

// POST /api/categories (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    const category = await FoodCategory.create({ name, description, image_url });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists.' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

// PUT /api/categories/:id (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    const category = await FoodCategory.findByIdAndUpdate(
      req.params.id,
      { name, description, image_url },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists.' });
    }
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

// DELETE /api/categories/:id (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await FoodCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};
