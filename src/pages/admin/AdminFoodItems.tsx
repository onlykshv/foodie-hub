import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { PageLoader } from '@/components/ui/loading-spinner';
import {
  useAllFoodItems,
  useFoodCategories,
  useCreateFoodItem,
  useUpdateFoodItem,
  useDeleteFoodItem,
} from '@/hooks/useFoodItems';
import { FoodItem } from '@/types/database';
import { toast } from 'sonner';

const emptyItem = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category_id: '',
  is_available: true,
  preparation_time: 15,
};

const AdminFoodItems = () => {
  const { data: foodItems, isLoading: itemsLoading } = useAllFoodItems();
  const { data: categories, isLoading: categoriesLoading } = useFoodCategories();
  const createItem = useCreateFoodItem();
  const updateItem = useUpdateFoodItem();
  const deleteItem = useDeleteFoodItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState(emptyItem);

  const isLoading = itemsLoading || categoriesLoading;

  const handleOpenDialog = (item?: FoodItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        image_url: item.image_url || '',
        category_id: item.category_id || '',
        is_available: item.is_available,
        preparation_time: item.preparation_time || 15,
      });
    } else {
      setEditingItem(null);
      setFormData(emptyItem);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          ...formData,
          category_id: formData.category_id || null,
        });
        toast.success('Item updated successfully');
      } else {
        await createItem.mutateAsync({
          ...formData,
          category_id: formData.category_id || null,
        });
        toast.success('Item created successfully');
      }
      setIsDialogOpen(false);
      setFormData(emptyItem);
      setEditingItem(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success('Item deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold">Food Items</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Food Item' : 'Add Food Item'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="prep_time">Prep Time (min)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    min="1"
                    value={formData.preparation_time}
                    onChange={e => setFormData({ ...formData, preparation_time: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={value => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_available">Available</Label>
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={checked => setFormData({ ...formData, is_available: checked })}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createItem.isPending || updateItem.isPending}
              >
                {(createItem.isPending || updateItem.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingItem ? (
                  'Update Item'
                ) : (
                  'Create Item'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Items grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {foodItems?.map((item, index) => (
          <div
            key={item.id}
            className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="aspect-[4/3] relative">
              <img
                src={item.image_url || '/placeholder.svg'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {!item.is_available && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-sm font-medium">Unavailable</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <span className="font-bold text-primary whitespace-nowrap">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>

              {item.category && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  {item.category.name}
                </span>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenDialog(item)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!foodItems || foodItems.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          No food items yet. Add your first item!
        </div>
      )}
    </div>
  );
};

export default AdminFoodItems;
