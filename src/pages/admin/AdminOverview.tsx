import React from 'react';
import { ShoppingBag, UtensilsCrossed, DollarSign, Clock } from 'lucide-react';
import { useAdminOrders } from '@/hooks/useOrders';
import { useAllFoodItems } from '@/hooks/useFoodItems';
import { PageLoader } from '@/components/ui/loading-spinner';

const AdminOverview = () => {
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();
  const { data: foodItems, isLoading: itemsLoading } = useAllFoodItems();

  const isLoading = ordersLoading || itemsLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  const pendingOrders = orders?.filter(o => o.status !== 'delivered').length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalItems = foodItems?.length || 0;

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Menu Items',
      value: totalItems,
      icon: UtensilsCrossed,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-6 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold text-lg">Recent Orders</h2>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items?.length || 0} items • ₹{Number(order.total_amount).toFixed(2)}
                  </p>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
