import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  ArrowLeft,
  ChefHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { NewOrderAlert } from '@/components/admin/NewOrderAlert';
import { useAdminOrders } from '@/hooks/useOrders';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const { data: orders } = useAdminOrders();
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const [newOrderCount, setNewOrderCount] = useState(0);

  // Enable real-time subscriptions (stub - implement your WebSocket here)
  useRealtimeOrders();

  // Track new orders
  useEffect(() => {
    const placedOrders = orders?.filter(o => o.status === 'placed').length || 0;
    if (placedOrders > lastSeenCount) {
      setNewOrderCount(prev => prev + (placedOrders - lastSeenCount));
    }
    setLastSeenCount(placedOrders);
  }, [orders, lastSeenCount]);

  const handleClearAlerts = () => {
    setNewOrderCount(0);
  };

  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: orders?.filter(o => o.status === 'placed').length },
    { path: '/admin/food-items', label: 'Food Items', icon: UtensilsCrossed },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo + Notifications */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <ChefHat className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">Foodie Hub</span>
                <span className="text-xs text-muted-foreground block">Kitchen</span>
              </div>
            </Link>
            <NewOrderAlert 
              newOrderCount={newOrderCount} 
              onClearAlerts={handleClearAlerts} 
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => item.path === '/admin/orders' && handleClearAlerts()}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                isActive(item.path, item.exact)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>

          <div className="space-y-2">
            <Link to="/" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
