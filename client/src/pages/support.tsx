import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit the support message to the backend
      const response = await fetch('/api/support-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          timestamp: new Date().toISOString(),
          source: 'support_page'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours. Thank you for contacting us!",
      });
      
      // Clear form
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error('Support message error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us on WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
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

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
              Send Us a Message
            </h2>
            
            <Card className="border-none shadow-xl bg-white">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-900 mb-2">
                      Your Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-lg font-medium text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-lg font-medium text-gray-900 mb-2">
                      Your Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      className="min-h-32 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">Need immediate help?</p>
                  <Button 
                    onClick={openWhatsApp}
                    variant="outline" 
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-lg px-8"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp Us
                  </Button>
                </div>
              </CardContent>
            </Card>
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