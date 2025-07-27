import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { ChatSupport } from "@/components/chat-support";
import { Search, ShoppingCart, User, Store, Plus, Minus, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product, OrderItem } from "@shared/schema";

interface VendorDashboardProps {
  userProfile: any;
}

export default function VendorDashboard({ userProfile }: VendorDashboardProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("search");
  const [profile, setProfile] = useState({
    fullName: userProfile?.fullName || user?.email || "Vendor",
    businessName: userProfile?.businessName || "Your Business",
    phone: userProfile?.phone || "",
    location: userProfile?.location || "",
    businessAddress: userProfile?.businessAddress || "",
  });

  const { products, loading: productsLoading } = useProducts();
  const { createOrder, orders, loading: ordersLoading } = useOrders();
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allProducts = products || [];
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.isActive !== false;
  });

  const categories = ["all", ...Array.from(new Set(allProducts.map(p => p.category)))];
  const vendorOrders = orders.filter(order => order.vendorId === user?.uid);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = allProducts.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (Object.keys(cart).length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Group cart items by supplier
      const ordersBySupplier: { [supplierId: string]: OrderItem[] } = {};
      
      Object.entries(cart).forEach(([productId, quantity]) => {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
          if (!ordersBySupplier[product.supplierId]) {
            ordersBySupplier[product.supplierId] = [];
          }
          ordersBySupplier[product.supplierId].push({
            productId: product.id,
            productName: product.name,
            quantity,
            price: product.price,
            unit: product.unit,
          });
        }
      });

      // Create separate orders for each supplier
      for (const [supplierId, items] of Object.entries(ordersBySupplier)) {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        await createOrder({
          vendorId: user?.uid!,
          supplierId,
          items,
          totalAmount,
          deliveryAddress: profile.businessAddress || "Default Address",
          vendorName: profile.fullName,
          supplierName: allProducts.find(p => p.supplierId === supplierId)?.supplierName || "Supplier",
        });
      }

      setCart({});
      toast({
        title: "Orders Placed!",
        description: `${Object.keys(ordersBySupplier).length} order(s) placed successfully.`,
      });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

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
              <span className="ml-4 text-sm text-muted-foreground">Vendor Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile.fullName}
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent border-b-0">
              <TabsTrigger
                value="search"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                <Search className="mr-2" size={16} />
                Browse Products
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                <ShoppingCart className="mr-2" size={16} />
                My Orders ({vendorOrders.length})
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                <User className="mr-2" size={16} />
                Profile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Browse Products Tab */}
          <TabsContent value="search">
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cart Summary */}
              {Object.keys(cart).length > 0 && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Cart: {Object.keys(cart).length} items</h3>
                        <p className="text-sm text-muted-foreground">Total: ₹{getCartTotal().toFixed(2)}</p>
                      </div>
                      <Button onClick={handlePlaceOrder} className="bg-orange-600 hover:bg-orange-700">
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Products Grid */}
              {productsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        {product.imageUrl && (
                          <div className="w-full h-48 mb-3 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                          <Badge variant="secondary">{product.unit}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Stock: {product.stockQuantity}</p>
                          <p>Min Order: {product.minimumOrder || 1}</p>
                          <p>Delivery: {product.deliveryTime}</p>
                          <p>Category: {product.category}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          {cart[product.id] ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(product.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{cart[product.id]}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(product.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToCart(product.id)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
                <p className="text-muted-foreground">Track your order history and status</p>
              </div>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p>Loading orders...</p>
                </div>
              ) : vendorOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vendorOrders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                            <CardDescription>
                              Placed on {order.orderDate.toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              order.status === "delivered" ? "default" :
                              order.status === "cancelled" ? "destructive" :
                              "secondary"
                            }
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>Supplier:</strong> {order.supplierName || "Unknown"}</p>
                              <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                              {order.estimatedDelivery && (
                                <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery.toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold mb-2">Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.productName} x {item.quantity} {item.unit}</span>
                                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {order.notes && (
                            <div className="pt-2 border-t">
                              <p className="text-sm"><strong>Notes:</strong> {order.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
              
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={profile.businessName}
                          onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Textarea
                          id="businessAddress"
                          value={profile.businessAddress}
                          onChange={(e) => setProfile({ ...profile, businessAddress: e.target.value })}
                          placeholder="Enter your complete business address"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Update Profile
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ChatSupport />
    </div>
  );
}
