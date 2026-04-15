import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FoodItem } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface FoodCardProps {
  item: FoodItem;
}

export function FoodCard({ item }: FoodCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to cart!`, {
      position: 'bottom-right',
    });
  };

  return (
    <div className="food-card group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image_url || '/placeholder.svg'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Quick add button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-accent"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
          <span className="font-bold text-primary whitespace-nowrap">
            ₹{item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {item.preparation_time && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{item.preparation_time} min</span>
            </div>
          )}

          <Button
            size="sm"
            onClick={handleAddToCart}
            className="ml-auto"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
