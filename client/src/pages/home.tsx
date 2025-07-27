import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AuthModal } from "@/components/auth-modal";
import { ChatSupport } from "@/components/chat-support";
import { Header } from "@/components/header";
import { useLanguage } from "@/hooks/use-language";
import { 
  Store, MapPin, IndianRupee, Shield, Utensils, Truck, Search, 
  CheckCircle, DollarSign, Clock, Star, Quote, ChevronRight,
  Facebook, Instagram, Linkedin, MessageCircle, Globe, Languages,
  Users
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
  const { t } = useLanguage();

  const openAuthModal = (userType?: "vendor" | "supplier", mode: "login" | "signup" = "login") => {
    setAuthModal({ isOpen: true, userType, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false });
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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => openAuthModal("vendor", "signup")}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
              >
                <Users className="mr-2" size={20} />
                {t('home.hero.vendorButton')}
              </Button>
              <Button
                onClick={() => openAuthModal("supplier", "signup")}
                size="lg"
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3"
              >
                <Truck className="mr-2" size={20} />
                {t('home.hero.supplierButton')}
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-gray-600">Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8★</div>
                <div className="text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose StreetSupply?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Solving real problems faced by street food vendors across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Local Suppliers */}
            <Card className="border shadow-sm">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-orange-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Local Suppliers</h3>
                <p className="text-gray-600">
                  Connect with nearby suppliers to reduce delivery time and costs.
                </p>
              </CardContent>
            </Card>

            {/* Best Prices */}
            <Card className="border shadow-sm">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
                <p className="text-gray-600">
                  Compare quotes from multiple suppliers to get the best deals.
                </p>
              </CardContent>
            </Card>

            {/* Quality Assured */}
            <Card className="border shadow-sm">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
                <p className="text-gray-600">
                  All suppliers are verified and rated by our community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600">
              Find everything you need for your street food business
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="border shadow-sm hover:shadow-md cursor-pointer">
                <CardContent className="text-center p-4">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Vendors Say
            </h2>
            <p className="text-gray-600">
              Success stories from street food vendors across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.business}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <div className="flex text-yellow-400 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Store className="mr-2" size={24} />
                StreetSupply
              </h3>
              <p className="text-gray-400 mb-4">
                Connecting street food vendors with reliable suppliers across India.
              </p>
              <div className="flex space-x-4">
                <Facebook size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                <Instagram size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin size={20} className="text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Find Suppliers</li>
                <li>Compare Prices</li>
                <li>Track Orders</li>
                <li>Bulk Discounts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>List Products</li>
                <li>Manage Orders</li>
                <li>Analytics</li>
                <li>Payments</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 StreetSupply. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
      />

      {/* Chat Support */}
      <ChatSupport />
    </div>
  );
}