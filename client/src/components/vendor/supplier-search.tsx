import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/use-products";
import { useFirestore } from "@/hooks/use-firestore";
import { Search, MapPin, Clock, Package, IndianRupee, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupplierSearchProps {
  onOrderClick: (supplierId: string, products: any[]) => void;
}

export function SupplierSearch({ onOrderClick }: SupplierSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { products, loading, error } = useProducts();
  const { toast } = useToast();

  // Filter products based on search criteria
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplierName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || product.supplierLocation?.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation && product.isActive;
  });

  // Group products by supplier
  const productsBySupplier = filteredProducts.reduce((acc, product) => {
    const supplierId = product.supplierId;
    if (!acc[supplierId]) {
      acc[supplierId] = {
        supplierId,
        supplierName: product.supplierName || "Unknown Supplier",
        supplierLocation: product.supplierLocation || "Unknown Location",
        products: []
      };
    }
    acc[supplierId].products.push(product);
    return acc;
  }, {} as Record<string, any>);

  const suppliers = Object.values(productsBySupplier);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "spices", label: "Spices & Seasonings" },
    { value: "rice", label: "Rice & Grains" },
    { value: "oil", label: "Cooking Oils" },
    { value: "vegetables", label: "Vegetables" },
    { value: "dairy", label: "Dairy Products" },
    { value: "meat", label: "Meat & Poultry" },
    { value: "flour", label: "Flour & Baking" },
    { value: "snacks", label: "Snacks & Beverages" },
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Chennai", label: "Chennai" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Pune", label: "Pune" },
    { value: "Kolkata", label: "Kolkata" },
  ];

  const handleOrder = (supplier: any) => {
    toast({
      title: "Order Initiated",
      description: `Contact ${supplier.supplierName} to place your order.`,
    });
    onOrderClick(supplier.supplierId, supplier.products);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading suppliers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Suppliers</h2>
          <p className="text-muted-foreground">
            Discover suppliers in your area and browse their product catalog
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Unable to load suppliers. Please check your connection.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Suppliers</h2>
        <p className="text-muted-foreground">
          Discover suppliers in your area and browse their product catalog
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {suppliers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Suppliers Found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new suppliers.
              </p>
            </CardContent>
          </Card>
        ) : (
          suppliers.map((supplier) => (
            <Card key={supplier.supplierId} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {supplier.supplierName}
                      </h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {supplier.supplierLocation}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Package className="h-4 w-4 mr-1" />
                        {supplier.products.length} products available
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleOrder(supplier)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Contact Supplier
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {supplier.products.map((product: any) => (
                      <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-white">
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
                                    <div class="w-full h-full flex items-center justify-center">
                                      <svg class="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs px-2 py-1">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Product details */}
                        <div className="p-3 space-y-2">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h4>
                          
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
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Min: {product.minimumOrder}</span>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {product.deliveryTime.replace('-', ' ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {suppliers.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Found {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} with {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}