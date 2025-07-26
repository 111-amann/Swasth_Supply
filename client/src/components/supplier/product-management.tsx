import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";

import { Plus, Edit, TrendingUp, Package, Trash2 } from "lucide-react";
import { z } from "zod";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  unit: z.string().min(1, "Unit is required"),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
  minimumOrder: z.string().min(1, "Minimum order is required"),
  deliveryTime: z.string().min(1, "Delivery time is required"),
  imageUrl: z.string().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export function ProductManagement() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      unit: "kg",
      stockQuantity: "",
      minimumOrder: "1",
      deliveryTime: "same-day",
      imageUrl: "",
    },
  });

  // Filter products for current supplier using Firebase UID
  const supplierProducts = products.filter((product: Product) => 
    product.supplierId === user?.uid
  );

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "Please make sure you're logged in.",
        variant: "destructive",
      });
      return;
    }

    try {
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity),
        minimumOrder: parseInt(data.minimumOrder),
        supplierId: user.uid, // Use Firebase UID directly
        isActive: true,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Success", 
          description: "Product added successfully!",
        });
      }

      // Reset form and close dialogs
      form.reset();
      setIsAddingProduct(false);
      setEditingProduct(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price.toString(),
      unit: product.unit,
      stockQuantity: product.stockQuantity.toString(),
      minimumOrder: product.minimumOrder.toString(),
      deliveryTime: product.deliveryTime,
      imageUrl: product.imageUrl || "",
    });
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    form.reset();
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Product Management</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product inventory and listings</p>
        </div>
        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm 
              form={form} 
              onSubmit={onSubmit} 
              onCancel={resetForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplierProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Active listings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supplierProducts.filter((p: Product) => p.stockQuantity < 10).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(supplierProducts.map((p: Product) => p.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Products</h3>
        {supplierProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first product to your inventory
              </p>
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {supplierProducts.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  {/* Square image container */}
                  <div className="aspect-square relative bg-gray-50">
                    {product.imageUrl && product.imageUrl !== 'undefined' ? (
                      <img
                        src={
                          product.imageUrl.startsWith('http') 
                            ? product.imageUrl 
                            : product.imageUrl.startsWith('/uploads/')
                            ? `${window.location.origin}${product.imageUrl}`
                            : `${window.location.origin}/uploads/${product.imageUrl}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', product.imageUrl);
                          const parentDiv = e.currentTarget.parentElement;
                          if (parentDiv) {
                            parentDiv.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                <svg class="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Product details */}
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h4>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600 text-sm">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-gray-500">
                        /{product.unit}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${product.stockQuantity < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {product.stockQuantity} in stock
                      </span>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1 pt-2">
                      <Dialog 
                        open={editingProduct?.id === product.id} 
                        onOpenChange={(open) => !open && setEditingProduct(null)}
                      >
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <ProductForm 
                            form={form} 
                            onSubmit={onSubmit} 
                            onCancel={resetForm}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ 
  form, 
  onSubmit, 
  onCancel 
}: { 
  form: any; 
  onSubmit: (data: ProductFormData) => void; 
  onCancel: () => void; 
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your product" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="l">Liter (l)</SelectItem>
                    <SelectItem value="ml">Milliliter (ml)</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                    <SelectItem value="packet">Packet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Available quantity" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minimumOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Minimum order quantity" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="deliveryTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="same-day">Same Day</SelectItem>
                    <SelectItem value="next-day">Next Day</SelectItem>
                    <SelectItem value="2-3-days">2-3 Days</SelectItem>
                    <SelectItem value="3-5-days">3-5 Days</SelectItem>
                    <SelectItem value="1-week">1 Week</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                />  
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Product
          </Button>
        </div>
      </form>
    </Form>
  );
}