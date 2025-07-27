import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AuthModal } from "@/components/auth-modal";
import { ChatSupport } from "@/components/chat-support";
import { 
  Store, MapPin, IndianRupee, Shield, Utensils, Truck, Search, 
  CheckCircle, DollarSign, Clock, Star, Quote, ChevronRight,
  Facebook, Instagram, Linkedin, MessageCircle, Globe, Languages,
  Users, Zap, TrendingUp, Award, Heart, Target, Sparkles, Rocket
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    userType?: "vendor" | "supplier";
    mode?: "login" | "signup";
  }>({
    isOpen: false,
  });
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchQuery, setSearchQuery] = useState("");

  const openAuthModal = (userType?: "vendor" | "supplier", mode: "login" | "signup" = "login") => {
    setAuthModal({ isOpen: true, userType, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  const categories = [
    { name: "Vegetables", icon: "🥕", desc: "Fresh vegetables & produce" },
    { name: "Spices", icon: "🌶️", desc: "Authentic Indian spices" },
    { name: "Packaging", icon: "🧴", desc: "Food containers & wraps" },
    { name: "Sauces", icon: "🍅", desc: "Chutneys & condiments" },
    { name: "Oils & Ghee", icon: "🛢️", desc: "Cooking oils & pure ghee" },
    { name: "Flours", icon: "🌾", desc: "Wheat, rice & specialty flours" }
  ];

  const testimonials = [
    {
      name: "Ravi Kumar",
      business: "Vada Pav Stall",
      location: "Pune",
      quote: "StreetSupply helped me save ₹3,000 every month! Quality is amazing.",
      avatar: "👨‍🍳"
    },
    {
      name: "Priya Sharma",
      business: "Chaat Corner", 
      location: "Delhi",
      quote: "Fast delivery and verified suppliers. My business runs smoothly now!",
      avatar: "👩‍🍳"
    },
    {
      name: "Amit Singh",
      business: "Dosa Point",
      location: "Mumbai",
      quote: "Best prices in the market. I can focus on cooking, not sourcing!",
      avatar: "👨‍🍳"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary flex items-center">
                  <Store className="mr-2" size={28} />
                  StreetSupply
                </h1>
                <p className="text-xs text-muted-foreground font-medium hindi-text">स्ट्रीट सप्लाई</p>
              </div>
              
              {/* Search Bar */}
              <div className="hidden lg:flex items-center max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search raw materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  About
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  How it Works
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Support
                </Button>
              </Link>
              
              {/* Language Toggle */}
              <Button
                onClick={toggleLanguage}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
              >
                <Languages size={16} />
                <span>{language === "en" ? "English" : "हिंदी"}</span>
              </Button>
              
              <Button
                onClick={() => openAuthModal("vendor", "login")}
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200"
              >
                Login
              </Button>
              <Button
                onClick={() => openAuthModal("vendor", "signup")}
                className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-green-600 opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='45' cy='15' r='1'/%3E%3Ccircle cx='15' cy='45' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Get Fresh Raw Materials at<br />
                <span className="text-amber-300">Best Prices</span><br />
                For Street Food<br />
                <span className="text-green-300">Vendors Across India</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Connect directly with trusted local suppliers. Save money, get verified quality, and grow your business.
              </p>
              <p className="text-lg mb-12 opacity-80 hindi-text">
                विश्वसनीय स्थानीय आपूर्तिकर्ताओं से सीधे जुड़ें • पैसे बचाएं और अपना व्यापार बढ़ाएं
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0 mb-8">
                <Button
                  onClick={() => openAuthModal("vendor", "signup")}
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Users className="mr-2" size={20} />
                  Join as Vendor
                </Button>
                <Button
                  onClick={() => openAuthModal("supplier", "signup")}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Truck className="mr-2" size={20} />
                  Join as Supplier
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="text-amber-300" size={24} />
                  </div>
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm opacity-80">Happy Vendors</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Rocket className="text-green-300" size={24} />
                  </div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm opacity-80">Suppliers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="text-yellow-300" size={24} />
                  </div>
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-sm opacity-80">Rating</div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 opacity-90">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="text-green-300" size={20} />
                  <span>Verified Suppliers</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="text-amber-300" size={20} />
                  <span>Bulk Discounts</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="text-blue-300" size={20} />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🍛</div>
                    <p className="text-2xl font-bold">Fresh Ingredients</p>
                    <p className="text-lg opacity-80">Delivered Daily</p>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  🥕
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl animate-bounce delay-75">
                  🌶️
                </div>
                <div className="absolute top-1/2 -left-8 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl animate-pulse">
                  🧄
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Improved */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose StreetSupply?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Solving real problems faced by street food vendors across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Local Suppliers */}
            <Card className="vendor-card group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">🧭 Local Suppliers</h3>
                <p className="text-muted-foreground">
                  We connect you with nearby suppliers to reduce time and cost.
                </p>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  📍 Pin-drop accurate location matching
                </div>
              </CardContent>
            </Card>

            {/* Best Prices */}
            <Card className="vendor-card group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <IndianRupee className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">💰 Best Prices</h3>
                <p className="text-muted-foreground">
                  Compare quotes from multiple suppliers instantly.
                </p>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  📊 Real-time price comparison
                </div>
              </CardContent>
            </Card>

            {/* Verified Quality */}
            <Card className="vendor-card group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">🛡️ 100% Verified Suppliers</h3>
                <p className="text-muted-foreground">
                  Real reviews. No fake listings. Quality guaranteed.
                </p>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  ⭐ Verified through document check & reviews
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📣 What Our Users Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real stories from vendors and suppliers across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.business}, {testimonial.location}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 text-primary opacity-20" size={24} />
                    <p className="text-gray-700 italic pl-6">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="text-yellow-400 fill-current" size={16} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📦 Popular Categories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our most requested raw materials and ingredients
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white border-2 hover:border-orange-500 hover:bg-gradient-to-br hover:from-orange-50 hover:to-green-50"
                onClick={() => openAuthModal("vendor", "signup")}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-red-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still Confused? Try StreetSupply for FREE
          </h2>
          <p className="text-xl mb-8 opacity-90">
            No registration needed. Explore suppliers and see live prices right now!
          </p>
          <Button
            onClick={() => openAuthModal("vendor", "signup")}
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-lg px-12 py-4 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Explore Suppliers Now
            <ChevronRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Store className="mr-2" size={24} />
                StreetSupply
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Connecting street food vendors with trusted suppliers across India.
              </p>
              <p className="text-xs text-gray-400 hindi-text mb-4">स्ट्रीट सप्लाई - आपका विश्वसनीय साथी</p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Partner with Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Business</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">Supplier Verification Process</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Business Analytics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bulk Order Management</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Payment Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><a href="tel:+917887641151" className="hover:text-primary transition-colors">📞 Call: +91 78876 41151</a></li>
                <li><a href="https://wa.me/917887641151" className="hover:text-primary transition-colors flex items-center">
                  <MessageCircle size={16} className="mr-1" /> Chat with Support
                </a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 StreetSupply. Made for Indian street food vendors with ❤️
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
