import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { CartItem } from '@/components/cart/CartItem';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
  const { items, totalItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

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
          <h1 className="font-display text-2xl md:text-3xl font-bold">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items yet
            </p>
            <Link to="/">
              <Button>Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.foodItem.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CartItem item={item} />
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" onClick={clearCart} className="text-destructive">
                  Clear Cart
                </Button>
                <Link to="/">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{(totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-border mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl text-primary">
                    ₹{(totalAmount * 1.1).toFixed(2)}
                  </span>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full h-12 text-base"
                >
                  {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {!user && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    You'll need to sign in to place your order
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
