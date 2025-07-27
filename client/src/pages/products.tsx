import { useProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, Package, Clock, MapPin, Store, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const { products, loading } = useProducts();
  const { toast } = useToast();

  const handleOrder = (product: any) => {
    toast({
      title: "Order Interest",
      description: `Contact supplier for ${product.name}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Products...</h1>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary flex items-center">
                <Store className="mr-2" size={28} />
                Swasth Supply
              </h1>
              <span className="ml-4 text-sm text-muted-foreground">All Products</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Available Products ({products.length})
          </h2>
          <p className="text-muted-foreground">
            All products fetched directly from Firebase database
          </p>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Products Found
              </h3>
              <p className="text-muted-foreground">
                No products available in Firebase database at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {product.name}
                    </CardTitle>
                    <Badge 
                      variant={product.isActive ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="mr-2">
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary flex items-center">
                        <IndianRupee className="h-5 w-5" />
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        per {product.unit}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Package className="h-4 w-4 mr-1" />
                        {product.stockQuantity} in stock
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {product.deliveryTime}
                      </div>
                    </div>
                    
                    {product.supplierName && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Store className="h-4 w-4 mr-1" />
                          {product.supplierName}
                        </div>
                        {product.supplierLocation && (
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {product.supplierLocation}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Min. order: {product.minimumOrder || 1} {product.unit}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleOrder(product)}
                    className="w-full"
                    disabled={!product.isActive}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Contact Supplier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}