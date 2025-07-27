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

export function ProductManagement() {
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
  const supplierProducts =
    products?.filter((p) => p.supplierId === user?.uid) || [];

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
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isAdding} onOpenChange={resetForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <ProductForm form={form} onSubmit={onSubmit} onCancel={resetForm} />
          </DialogContent>
        </Dialog>
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

      {/* Product Grid */}
      <div className="grid gap-4">
        {allProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-all duration-150">
            <CardContent className="p-0">
              <div className="aspect-square relative bg-gray-50">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                  {product.category}
                </Badge>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-semibold text-sm">{product.name}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {product.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <span>₹{product.price.toFixed(2)}</span>
                  <span className="text-xs">{product.unit}</span>
                </div>
                <span
                  className={`text-xs ${
                    product.stockQuantity < 10 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {product.stockQuantity} in stock
                </span>

                <div className="flex gap-2 pt-2">
                  <Dialog open={editing?.id === product.id} onOpenChange={resetForm}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-3 h-3 mr-1" /> Edit
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
        {/* same form fields as before */}
        {/* ... */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </Form>
  );
}
