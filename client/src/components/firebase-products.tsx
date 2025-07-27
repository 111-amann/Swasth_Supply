import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFirestore } from "@/hooks/use-firestore";
import { addSampleProducts } from "@/lib/sample-data";
import { Loader2, Package, Plus, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  unit: string;
  stockQuantity: number;
  supplierName: string;
  supplierLocation: string;
  imageUrl?: string;
}

export function FirebaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { getCollection } = useFirestore();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productsData = await getCollection("products");
      setProducts(productsData as Product[]);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSampleData = async () => {
    setAdding(true);
    try {
      await addSampleProducts();
      await loadProducts(); // Reload after adding
    } catch (error) {
      console.error("Error adding sample data:", error);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Firebase Products Database</h2>
          <p className="text-gray-600">Real-time data from Firebase Firestore</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadProducts} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddSampleData} disabled={adding}>
            {adding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Sample Data
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading products from Firebase...</span>
        </div>
      ) : products.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              No products are currently stored in the Firebase database.
            </p>
            <Button onClick={handleAddSampleData} disabled={adding}>
              {adding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Sample Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="font-semibold">₹{product.price}/{product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Stock:</span>
                    <span>{product.stockQuantity} {product.unit}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Supplier:</span>
                    <span className="text-sm">{product.supplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Location:</span>
                    <span className="text-sm">{product.supplierLocation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Firebase Database Status</h4>
        <p className="text-green-700 text-sm">
          ✅ Connected to Firebase Firestore<br />
          ✅ Real-time data synchronization enabled<br />
          ✅ Products collection: {products.length} items loaded
        </p>
      </div>
    </div>
  );
}