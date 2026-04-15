import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { OrderStatus } from '@/types/database';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusOrder: OrderStatus[] = ['placed', 'preparing', 'ready', 'delivered'];

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  placed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
  delivered: null,
};

const AdminOrders = () => {
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleUpdateStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const newStatus = nextStatus[currentStatus];
    if (!newStatus) return;

    try {
      await updateStatus.mutateAsync({
        orderId,
        currentStatus,
        newStatus,
      });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  // Group orders by status
  const groupedOrders = statusOrder.reduce((acc, status) => {
    acc[status] = orders?.filter(o => o.status === status) || [];
    return acc;
  }, {} as Record<OrderStatus, typeof orders>);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold mb-8">Order Management</h1>

      {/* Status columns */}
      <div className="grid lg:grid-cols-4 gap-6">
        {statusOrder.map(status => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold capitalize">{status}</h2>
              <span className="text-sm text-muted-foreground">
                {groupedOrders[status]?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {groupedOrders[status]?.map(order => (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* Order header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedOrder(
                      expandedOrder === order.id ? null : order.id
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.items?.length || 0} items
                      </span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedOrder === order.id && (
                    <div className="px-4 pb-4 border-t border-border pt-4 animate-fade-in">
                      <div className="space-y-2 mb-4">
                        {order.items?.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.food_item_name}</span>
                            <span className="text-muted-foreground">
                              ₹{item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground mb-4">
                        <p className="font-medium text-foreground mb-1">Delivery:</p>
                        <p>{order.delivery_address}</p>
                        <p>{order.phone}</p>
                        {order.notes && (
                          <p className="mt-2 italic">Note: {order.notes}</p>
                        )}
                      </div>

                      {nextStatus[order.status] && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleUpdateStatus(order.id, order.status)}
                          disabled={updateStatus.isPending}
                        >
                          {updateStatus.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            `Mark as ${nextStatus[order.status]}`
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {(!groupedOrders[status] || groupedOrders[status]?.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No orders
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
