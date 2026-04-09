import React from 'react';
import { FoodCategory } from '@/types/database';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: FoodCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          'flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-all duration-200',
          selectedCategory === null
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-all duration-200',
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
