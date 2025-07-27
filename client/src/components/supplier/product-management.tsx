// Merged ProductManagement Component

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Edit, TrendingUp, Package, Trash2 } from "lucide-react";
import { z } from "zod";

// Shared Product type
interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  minimumOrder: number | null;
  deliveryTime: string;
  imageUrl?: string | null;
  supplierId: string;
  isActive?: boolean | null;
}

const productFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  price: z.string().min(1),
  unit: z.string().min(1),
  stockQuantity: z.string().min(1),
  minimumOrder: z.string().min(1),
  deliveryTime: z.string().min(1),
  imageUrl: z.string().optional(),
});
type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductManagementProps {
  supplierId?: string;
}

export function ProductManagement({ supplierId }: ProductManagementProps = {}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const allProducts = products || [];
  const currentSupplierId = supplierId || user?.uid;
  const supplierProducts =
    products?.filter((p) => p.supplierId === currentSupplierId) || [];

  // Debug logging
  console.log("ProductManagement Debug:", {
    user: user?.uid,
    supplierId,
    currentSupplierId,
    totalProducts: products?.length || 0,
    supplierProducts: supplierProducts.length,
    products: products?.slice(0, 2) || [], // First 2 products for debugging
    loading,
    error
  });

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

  const resetForm = () => {
    form.reset();
    setIsAdding(false);
    setEditing(null);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "Please login first.",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity),
        minimumOrder: parseInt(data.minimumOrder) || 1,
        supplierId: user.uid,
        isActive: true,
      };

      if (editing) {
        await updateProduct(editing.id, payload);
        toast({ title: "Success", description: "Product updated" });
      } else {
        await createProduct(payload);
        toast({ title: "Success", description: "Product created" });
      }
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    form.reset({
      name: p.name,
      description: p.description || "",
      category: p.category,
      price: p.price.toString(),
      unit: p.unit,
      stockQuantity: p.stockQuantity.toString(),
      minimumOrder: p.minimumOrder?.toString() || "",
      deliveryTime: p.deliveryTime,
      imageUrl: p.imageUrl || "",
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({ title: "Deleted", description: "Product removed" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="mt-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[120px] bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">Manage your product inventory and listings</p>
        </div>
      </div>

      {error && (
        <div className="text-red-600">
          <p>Error loading products.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supplier stats */}
        <Card>
          <CardHeader>
            <CardTitle>My Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{supplierProducts.length}</div>
            <p className="text-sm text-muted-foreground">Your listings</p>
          </CardContent>
        </Card>

        {/* All products */}
        <Card>
          <CardHeader>
            <CardTitle>All Products (DB)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{allProducts.length}</div>
            <p className="text-sm text-muted-foreground">In Firebase</p>
          </CardContent>
        </Card>

        {/* Low stock */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {allProducts.filter((p) => p.stockQuantity < 10).length}
            </div>
            <p className="text-sm text-muted-foreground">Need restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Grid - Enhanced Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {supplierProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
            <CardContent className="p-0">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50">
                            <div class="text-center">
                              <Package class="w-12 h-12 text-orange-300 mx-auto mb-2" />
                              <p class="text-xs text-gray-500">No Image</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50">
                    <div className="text-center">
                      <Package className="w-12 h-12 text-orange-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No Image</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 shadow-sm"
                  >
                    {product.category}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant={product.stockQuantity < 10 ? "destructive" : "default"}
                    className={`text-xs font-medium px-2 py-1 shadow-sm ${
                      product.stockQuantity < 10 
                        ? "bg-red-500 text-white" 
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {product.stockQuantity} in stock
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                    {product.description || "No description available"}
                  </p>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{(() => {
                        const price = typeof product.price === 'number' ? product.price : parseFloat(product.price || '0');
                        return price.toFixed(2);
                      })()}
                    </span>
                    <span className="text-xs text-gray-500">per {product.unit}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Min Order</div>
                    <div className="text-sm font-medium">{product.minimumOrder || 1} {product.unit}</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                  Delivery: {product.deliveryTime.replace('-', ' ')}
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog open={editing?.id === product.id} onOpenChange={resetForm}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-sm hover:bg-orange-50 hover:border-orange-200"
                        onClick={() => handleEdit({
                          ...product,
                          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
                        } as Product)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      <ProductForm form={form} onSubmit={onSubmit} onCancel={resetForm} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Product Card */}
        <Dialog open={isAdding && !editing} onOpenChange={(open) => {
          if (!open) resetForm();
          else setIsAdding(true);
        }}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-orange-400 cursor-pointer group">
              <CardContent className="p-0">
                <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 rounded-t-lg">
                  <div className="text-center group-hover:scale-105 transition-transform duration-200">
                    <Plus className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-700 mb-1">Add New Product</p>
                    <p className="text-sm text-gray-500">Expand your inventory</p>
                  </div>
                </div>
                <div className="p-4">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Create Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm form={form} onSubmit={onSubmit} onCancel={resetForm} />
          </DialogContent>
        </Dialog>
      </div>

      {supplierProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-500 mb-6">Start building your product catalog to attract vendors</p>
          <Dialog open={isAdding && !editing} onOpenChange={(open) => {
            if (!open) resetForm();
            else setIsAdding(true);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Your First Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm form={form} onSubmit={onSubmit} onCancel={resetForm} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  form,
  onSubmit,
  onCancel,
}: {
  form: any;
  onSubmit: (d: ProductFormData) => void;
  onCancel: () => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="oil">Oil</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="flour">Flour</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="condiments">Condiments</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
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
                  placeholder="Describe your product..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
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
                    placeholder="0" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="minimumOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1" 
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
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            Save Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
