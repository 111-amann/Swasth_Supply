import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { ProductManagement } from "@/components/supplier/product-management";
import { OrderManagement } from "@/components/supplier/order-management";
import { ChatSupport } from "@/components/chat-support";
import { Package, ClipboardList, BarChart, User, Store, IndianRupee, ShoppingCart, Users, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupplierDashboardProps {
  userProfile: any;
}

export default function SupplierDashboard({ userProfile }: SupplierDashboardProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");

  const [profile, setProfile] = useState({
    businessName: userProfile?.businessName || "Your Business",
    ownerName: userProfile?.fullName || user?.email || "Supplier",
    phone: userProfile?.phone || "",
    deliveryRadius: userProfile?.deliveryRadius?.toString() || "10",
    businessAddress: userProfile?.businessAddress || "",
    businessDescription: userProfile?.businessDescription || "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your supplier profile has been updated successfully.",
    });
  };

  // Mock analytics data
  const analyticsData = {
    monthlyRevenue: 45600,
    totalOrders: 87,
    activeCustomers: 23,
    averageRating: 4.8,
    topProducts: [
      { name: "Basmati Rice", orders: 45 },
      { name: "Cooking Oil", orders: 32 },
      { name: "Spices Mix", orders: 28 },
    ],
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to access your supplier dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.businessName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {profile.ownerName}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ChatSupport />
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto p-0 bg-transparent border-b rounded-none w-full justify-start">
              <TabsTrigger
                value="products"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none"
              >
                <Package className="mr-2" size={16} />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none"
              >
                <ClipboardList className="mr-2" size={16} />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none"
              >
                <BarChart className="mr-2" size={16} />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none"
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
          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManagement supplierId={user.uid} />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrderManagement supplierId={user.uid} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Overview</h2>
                <p className="text-muted-foreground">
                  Track your business performance and growth
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <IndianRupee className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          Monthly Revenue
                        </p>
                        <p className="text-2xl font-bold">
                          ₹{analyticsData.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <ShoppingCart className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold">{analyticsData.totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          Active Customers
                        </p>
                        <p className="text-2xl font-bold">
                          {analyticsData.activeCustomers}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Star className="h-8 w-8 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          Average Rating
                        </p>
                        <p className="text-2xl font-bold">
                          {analyticsData.averageRating}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                  <div className="space-y-4">
                    {analyticsData.topProducts.map((product, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-muted-foreground">
                          {product.orders} orders
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Profile</h2>
                <p className="text-muted-foreground">
                  Manage your business information and settings
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={profile.businessName}
                          onChange={(e) =>
                            setProfile({ ...profile, businessName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="ownerName">Owner Name</Label>
                        <Input
                          id="ownerName"
                          value={profile.ownerName}
                          onChange={(e) =>
                            setProfile({ ...profile, ownerName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                        <Select
                          value={profile.deliveryRadius}
                          onValueChange={(value) =>
                            setProfile({ ...profile, deliveryRadius: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 km</SelectItem>
                            <SelectItem value="10">10 km</SelectItem>
                            <SelectItem value="15">15 km</SelectItem>
                            <SelectItem value="20">20 km</SelectItem>
                            <SelectItem value="25">25 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Textarea
                        id="businessAddress"
                        value={profile.businessAddress}
                        onChange={(e) =>
                          setProfile({ ...profile, businessAddress: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        value={profile.businessDescription}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            businessDescription: e.target.value,
                          })
                        }
                        rows={4}
                        placeholder="Tell vendors about your business, specialties, and what makes you unique..."
                      />
                    </div>

                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}