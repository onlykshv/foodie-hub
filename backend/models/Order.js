const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['placed', 'preparing', 'ready', 'delivered'],
      default: 'placed',
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    delivery_address: {
      type: String,
      required: [true, 'Delivery address is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        if (ret.user_id && typeof ret.user_id === 'object' && ret.user_id._id) {
          ret.profile = {
            id: ret.user_id._id.toString(),
            user_id: ret.user_id._id.toString(),
            full_name: ret.user_id.fullName,
            email: ret.user_id.email,
            role: ret.user_id.role,
            phone: ret.user_id.phone,
            address: ret.user_id.address,
          };
          ret.user_id = ret.user_id._id.toString();
        }
        return ret;
      },
    },
  }
);

// Index for common queries
orderSchema.index({ user_id: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
