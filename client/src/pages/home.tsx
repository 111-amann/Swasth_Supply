import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/auth-modal";
import { ChatSupport } from "@/components/chat-support";
import { AddSampleData } from "@/components/admin/add-sample-data";
import { FirebaseDataViewer } from "@/components/debug/firebase-data-viewer";
import { Store, MapPin, IndianRupee, Shield, Utensils, Truck } from "lucide-react";

export default function Home() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    userType?: "vendor" | "supplier";
    mode?: "login" | "signup";
  }>({
    isOpen: false,
  });

  const openAuthModal = (userType?: "vendor" | "supplier", mode: "login" | "signup" = "login") => {
    setAuthModal({ isOpen: true, userType, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false });
  };

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary flex items-center">
                  <Store className="mr-2" size={28} />
                  Swasth Supply
                </h1>
                <p className="text-xs text-muted-foreground font-medium hindi-text">स्वच्छ आपूर्ति</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="/products">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  View Products
                </Button>
              </a>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                About
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                How it Works
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Support
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => openAuthModal(undefined, "login")}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Login
              </Button>
              <Button
                onClick={() => openAuthModal(undefined, "signup")}
                className="bg-primary hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="street-food-gradient py-16 text-white spice-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Raw Materials for<br />
              <span className="text-yellow-200">Street Food Vendors</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Connect with trusted suppliers near you. Get quality ingredients at wholesale prices.
            </p>
            <p className="text-lg mb-8 opacity-80 hindi-text">
              विश्वसनीय आपूर्तिकर्ताओं से जुड़ें • गुणवत्तापूर्ण सामग्री पाएं
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <Button
                onClick={() => openAuthModal("vendor", "signup")}
                className="bg-white text-primary px-8 py-6 rounded-xl text-lg font-semibold hover:bg-gray-100 shadow-lg h-auto"
              >
                <Utensils className="mr-3" size={24} />
                <div>
                  <div>I'm a Vendor</div>
                  <div className="text-sm text-muted-foreground font-normal">Buy raw materials</div>
                </div>
              </Button>
              <Button
                onClick={() => openAuthModal("supplier", "signup")}
                className="bg-secondary text-white px-8 py-6 rounded-xl text-lg font-semibold hover:bg-secondary/90 shadow-lg h-auto"
              >
                <Truck className="mr-3" size={24} />
                <div>
                  <div>I'm a Supplier</div>
                  <div className="text-sm text-green-100 font-normal">Sell to vendors</div>
                </div>
              </Button>
            </div>
            
            {/* Firebase Data Status and Sample Data Components */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <FirebaseDataViewer />
              <AddSampleData />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Swasth Supply?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Solving real problems faced by street food vendors across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="vendor-card">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Local Suppliers</h3>
                <p className="text-muted-foreground">
                  Find verified suppliers in your area. Reduce transportation costs and get fresh materials faster.
                </p>
              </CardContent>
            </Card>

            <Card className="vendor-card">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
                <p className="text-muted-foreground">
                  Compare prices from multiple suppliers. Access wholesale rates and bulk discounts.
                </p>
              </CardContent>
            </Card>

            <Card className="vendor-card">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
                <p className="text-muted-foreground">
                  All suppliers are verified. Read reviews and ratings from other vendors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Swasth Supply</h3>
              <p className="text-gray-300 text-sm mb-4">
                Connecting street food vendors with trusted suppliers across India.
              </p>
              <p className="text-xs text-gray-400 hindi-text">स्वच्छ आपूर्ति - आपका विश्वसनीय साथी</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">Find Suppliers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Compare Prices</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bulk Orders</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Order Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">List Products</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Manage Orders</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Business Analytics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Payment Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">WhatsApp Support</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Swasth Supply. Made for Indian street food vendors with ❤️
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        defaultUserType={authModal.userType}
        defaultMode={authModal.mode}
      />

      <ChatSupport />
    </div>
  );
}
