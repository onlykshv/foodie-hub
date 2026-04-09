const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    food_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      default: null,
    },
    food_item_name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        if (ret.order_id) ret.order_id = ret.order_id.toString();
        if (ret.food_item_id && typeof ret.food_item_id === 'object') {
          ret.food_item_id = ret.food_item_id.toString();
        }
        return ret;
      },
    },
  }
);

orderItemSchema.index({ order_id: 1 });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
