import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { FoodCard } from '@/components/food/FoodCard';
import { CategoryFilter } from '@/components/food/CategoryFilter';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useFoodItems, useFoodCategories } from '@/hooks/useFoodItems';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: foodItems, isLoading: itemsLoading } = useFoodItems();
  const { data: categories, isLoading: categoriesLoading } = useFoodCategories();

  const isLoading = itemsLoading || categoriesLoading;

  // Filter items
  const filteredItems = foodItems?.filter(item => {
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground to-foreground/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
              Delicious food,{' '}
              <span className="text-accent">delivered fast</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-slide-up">
              Order from the best local restaurants with easy, on-demand delivery.
            </p>

            {/* Search bar */}
            <div className="relative max-w-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card text-foreground border-0 shadow-xl rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            {/* Category filters */}
            {categories && categories.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display font-semibold text-xl mb-4">Categories</h2>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            )}

            {/* Food grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl">
                  {selectedCategory 
                    ? categories?.find(c => c.id === selectedCategory)?.name 
                    : 'All Items'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {filteredItems?.length || 0} items
                </p>
              </div>

              {filteredItems && filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <FoodCard item={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No items found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Foodie Hub. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Built with ❤️ for food lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
