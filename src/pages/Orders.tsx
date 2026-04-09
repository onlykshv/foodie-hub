import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { OrderCard } from '@/components/orders/OrderCard';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeCustomerOrders } from '@/hooks/useRealtimeOrders';

const Orders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();

  // Enable real-time updates (stub - implement your WebSocket here)
  useRealtimeCustomerOrders(user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to view your orders</h1>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold">My Orders</h1>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : orders && orders.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Your order history will appear here
            </p>
            <Link to="/">
              <Button>Browse Menu</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
