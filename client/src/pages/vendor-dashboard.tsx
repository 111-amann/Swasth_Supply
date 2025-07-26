import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { SupplierSearch } from "@/components/vendor/supplier-search";
import { OrderTracking } from "@/components/vendor/order-tracking";
import { ChatSupport } from "@/components/chat-support";
import { Search, ShoppingCart, User, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleOrderClick = (supplierId: string, products: any[]) => {
    toast({
      title: "Order Initiated",
      description: "Contact the supplier to complete your order.",
    });
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
                Find Suppliers
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                <ShoppingCart className="mr-2" size={16} />
                My Orders
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
          {/* Find Suppliers Tab */}
          <TabsContent value="search">
            <SupplierSearch onOrderClick={handleOrderClick} />
          </TabsContent>

          {/* My Orders Tab */}
          <TabsContent value="orders">
            <OrderTracking vendorId={user?.uid || ""} />
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
