import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Search, MessageCircle, Upload, Package, Bell } from "lucide-react";
import { Header } from "@/components/header";
import { AuthModal } from "@/components/auth-modal";

export default function HowItWorks() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    userType?: "vendor" | "supplier";
    mode?: "login" | "signup";
  }>({
    isOpen: false,
  });

  const openAuthModal = (userType: "vendor" | "supplier", mode: "login" | "signup" = "signup") => {
    setAuthModal({ isOpen: true, userType, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How <span className="text-green-600">StreetSupply</span> Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Simple steps to connect vendors with suppliers across India
          </p>
        </div>

        {/* For Vendors Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For <span className="text-orange-600">Street Food Vendors</span>
            </h2>
            <p className="text-lg text-gray-600">Get fresh ingredients delivered to your doorstep</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 - Register */}
            <Card className="border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
                    <UserPlus className="w-10 h-10 text-orange-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Register</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Sign up with your mobile number and tell us about your stall. 
                  Add your location and food specialties.
                </p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-800 font-medium">
                    ✓ Quick 2-minute setup<br/>
                    ✓ No documents required<br/>
                    ✓ Instant verification
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-orange-400" />
            </div>

            {/* Step 2 - Browse */}
            <Card className="border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                    <Search className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse Materials</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Explore fresh vegetables, spices, oils, and other raw materials 
                  from verified suppliers in your area.
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Live pricing updates<br/>
                    ✓ Quality assured products<br/>
                    ✓ Local suppliers nearby
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-green-400" />
            </div>

            {/* Step 3 - Order */}
            <Card className="border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                    <MessageCircle className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Easily</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Place orders through our app or WhatsApp. Pay on delivery or 
                  use digital payments - whatever works for you.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">
                    ✓ WhatsApp ordering<br/>
                    ✓ Flexible payment options<br/>
                    ✓ Same-day delivery
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action for Vendors */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => openAuthModal("vendor", "signup")}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-lg px-8 py-4"
            >
              Register as Vendor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-16"></div>

        {/* For Suppliers Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For <span className="text-green-600">Suppliers</span>
            </h2>
            <p className="text-lg text-gray-600">Reach thousands of vendors digitally</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 - Sign Up */}
            <Card className="border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                    <UserPlus className="w-10 h-10 text-purple-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Create your supplier profile with business details, 
                  location, and delivery area. Get verified by our team.
                </p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-800 font-medium">
                    ✓ Business verification<br/>
                    ✓ Set delivery radius<br/>
                    ✓ Professional profile
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-purple-400" />
            </div>

            {/* Step 2 - Upload Products */}
            <Card className="border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full">
                    <Upload className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Products</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Add your products with photos, prices, and availability. 
                  Update stock levels and pricing in real-time.
                </p>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-800 font-medium">
                    ✓ Easy product management<br/>
                    ✓ Real-time pricing<br/>
                    ✓ Photo uploads
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-indigo-400" />
            </div>

            {/* Step 3 - Get Orders */}
            <Card className="border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full">
                    <Bell className="w-10 h-10 text-teal-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Orders</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Receive instant notifications for new orders. Manage deliveries 
                  and build relationships with local vendors.
                </p>
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-teal-800 font-medium">
                    ✓ Instant order alerts<br/>
                    ✓ Delivery management<br/>
                    ✓ Vendor relationships
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action for Suppliers */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => openAuthModal("supplier", "signup")}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-4"
            >
              Register as Supplier
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <Card className="border-none shadow-2xl bg-gradient-to-r from-orange-100 via-yellow-50 to-green-100">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose StreetSupply?</h2>
              <p className="text-lg text-gray-700">Built for the Indian street food ecosystem</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h4 className="font-bold text-gray-900 mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-700">Same-day delivery within your city</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="font-bold text-gray-900 mb-2">Fair Pricing</h4>
                <p className="text-sm text-gray-700">Transparent, competitive rates</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h4 className="font-bold text-gray-900 mb-2">Quality Assured</h4>
                <p className="text-sm text-gray-700">Verified suppliers and fresh products</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h4 className="font-bold text-gray-900 mb-2">Local Support</h4>
                <p className="text-sm text-gray-700">Hindi/English support team</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Modal */}
        {authModal.isOpen && (
          <AuthModal
            isOpen={authModal.isOpen}
            onClose={closeAuthModal}
            defaultUserType={authModal.userType}
            defaultMode={authModal.mode}
          />
        )}
      </div>
    </div>
  );
}