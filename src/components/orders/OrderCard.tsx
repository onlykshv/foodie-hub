import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Order, OrderItem, OrderStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order & { items: OrderItem[] };
}

const statusConfig: Record<OrderStatus, { 
  icon: React.ElementType; 
  label: string; 
  className: string;
  description: string;
}> = {
  placed: {
    icon: Package,
    label: 'Placed',
    className: 'status-placed',
    description: 'Your order has been received',
  },
  preparing: {
    icon: Clock,
    label: 'Preparing',
    className: 'status-preparing',
    description: 'The kitchen is working on your order',
  },
  ready: {
    icon: CheckCircle,
    label: 'Ready',
    className: 'status-ready',
    description: 'Your order is ready for pickup/delivery',
  },
  delivered: {
    icon: Truck,
    label: 'Delivered',
    className: 'status-delivered',
    description: 'Order has been delivered',
  },
};

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
            </p>
          </div>
          <span className={cn('status-badge', status.className)}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1">
          {(['placed', 'preparing', 'ready', 'delivered'] as OrderStatus[]).map((s, i) => (
            <div
              key={s}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                ['placed', 'preparing', 'ready', 'delivered'].indexOf(order.status) >= i
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{status.description}</p>
      </div>

      {/* Items */}
      <div className="p-4">
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Order Items</h4>
        <div className="space-y-2">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.food_item_name}
              </span>
              <span className="text-muted-foreground">₹{item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <span className="font-medium">Total</span>
          <span className="font-bold text-lg text-primary">
            ₹{order.total_amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="px-4 pb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Delivery:</span> {order.delivery_address}
        </p>
      </div>
    </div>
  );
}
