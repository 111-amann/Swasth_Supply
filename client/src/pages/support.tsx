import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { Header } from "@/components/header";

const faqData = [
  {
    question: "How do I place my first order?",
    answer: "After registering, browse products in your area and click 'Order Now'. You can order through our app or WhatsApp. We'll confirm your order and arrange delivery within 2-4 hours."
  },
  {
    question: "What are the delivery charges?",
    answer: "Delivery is free for orders above ₹500. For smaller orders, we charge ₹30-50 depending on your location. Orders within 5km are usually delivered within 2 hours."
  },
  {
    question: "How do I make payments?",
    answer: "We accept cash on delivery, UPI, and digital wallets. You can pay when the products are delivered to your stall. For regular customers, we also offer weekly payment options."
  },
  {
    question: "What if I receive damaged or wrong items?",
    answer: "We guarantee fresh, quality products. If you're not satisfied, contact us immediately. We'll replace the items or refund your money within 24 hours. Your satisfaction is our priority."
  },
  {
    question: "Can I get products from multiple suppliers in one order?",
    answer: "Yes! You can order from different suppliers in your area. We'll coordinate the delivery and you'll receive everything together when possible, or notify you about separate delivery times."
  }
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello StreetSupply team! I need help with...");
    window.open(`https://wa.me/917887641151?text=${message}`, '_blank');
  };

  const callSupport = () => {
    window.open('tel:+917887641151', '_self');
  };

  const emailSupport = () => {
    window.open('mailto:support@streetsupply.in?subject=Support Request&body=Hello StreetSupply team,%0D%0A%0D%0AI need help with...', '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            We're Here to <span className="text-blue-600">Help</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Get support in Hindi or English from our friendly team
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-none shadow-xl bg-gradient-to-br from-green-100 to-green-200 hover:shadow-2xl transition-all duration-300 cursor-pointer" onClick={openWhatsApp}>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">WhatsApp Chat</h3>
              <p className="text-gray-700 mb-4">Get instant help on WhatsApp</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Chat Now
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-blue-100 to-blue-200 hover:shadow-2xl transition-all duration-300 cursor-pointer" onClick={callSupport}>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Call Us</h3>
              <p className="text-gray-700 mb-4">Speak to our support team</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => { e.stopPropagation(); callSupport(); }}>
                +91 78876 41151
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-orange-100 to-orange-200 hover:shadow-2xl transition-all duration-300 cursor-pointer" onClick={emailSupport}>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Us</h3>
              <p className="text-gray-700 mb-4">Send us your questions</p>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={(e) => { e.stopPropagation(); emailSupport(); }}>
                support@streetsupply.in
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader 
                  className="cursor-pointer p-6"
                  onClick={() => toggleFaq(index)}
                >
                  <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900">
                    <span className="pr-4">{faq.question}</span>
                    {openFaq === index ? 
                      <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" /> : 
                      <ChevronDown className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    }
                  </CardTitle>
                </CardHeader>
                
                {openFaq === index && (
                  <CardContent className="px-6 pb-6 pt-0">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <Card className="mt-16 border-none shadow-xl bg-gradient-to-r from-blue-100 to-purple-100">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Hours</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">WhatsApp & Phone</h4>
                <p className="text-gray-700">Monday - Saturday</p>
                <p className="text-gray-700">8:00 AM - 8:00 PM</p>
              </div>
              
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Email Support</h4>
                <p className="text-gray-700">24/7 Response</p>
                <p className="text-gray-700">Within 24 hours</p>
              </div>
              
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Emergency Orders</h4>
                <p className="text-gray-700">WhatsApp Available</p>
                <p className="text-gray-700">Sunday 10 AM - 6 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}