const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image_url: {
      type: String,
      default: null,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodCategory',
      default: null,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    preparation_time: {
      type: Number,
      default: 15, // in minutes
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        if (ret.category_id && typeof ret.category_id === 'object') {
          ret.category = ret.category_id;
          ret.category_id = ret.category.id;
        }
        return ret;
      },
    },
  }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
