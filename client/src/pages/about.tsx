import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Truck, Store, Handshake } from "lucide-react";
import { Header } from "@/components/header";
import { useLanguage } from "@/hooks/use-language";

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <Header />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16 border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission.title')}</h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              {t('about.mission.text')}
            </p>
          </CardContent>
        </Card>

        {/* Problem Statement */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('about.challenge.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl bg-red-50/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                  <Truck className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Mandi Visits</h3>
                <p className="text-gray-700">
                  Vendors waste precious hours traveling to wholesale markets, 
                  affecting their business hours and family time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-yellow-50/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Inconsistent Pricing</h3>
                <p className="text-gray-700">
                  Price fluctuations and lack of transparency make it difficult 
                  for vendors to plan their business and maintain profit margins.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-blue-50/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <Store className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Supply Disruptions</h3>
                <p className="text-gray-700">
                  Unreliable supply chains lead to stock shortages, forcing 
                  vendors to compromise on quality or close their stalls.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Who We Are */}
        <Card className="mb-16 border-none shadow-2xl bg-gradient-to-r from-orange-100 to-green-100">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-200 rounded-full mb-6">
                  <Users className="w-8 h-8 text-green-700" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  We are a passionate team of technologists, supply chain experts, and street food 
                  enthusiasts who understand the unique challenges faced by India's street vendors.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Born from the streets of Delhi and Mumbai, StreetSupply combines traditional 
                  trading relationships with modern technology to create sustainable solutions 
                  for our vendor community.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/60 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="text-6xl mb-4">🇮🇳</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Made in India</h3>
                  <p className="text-gray-700">For the streets, by the community</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why We Exist */}
        <Card className="mb-16 border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why We Exist</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Street food is the heart of Indian culture. From morning chai to late-night 
                chaat, our vendors feed millions and preserve culinary traditions passed down 
                through generations.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                We exist to ensure these micro-entrepreneurs can focus on what they do best – 
                creating delicious, authentic food – while we handle their supply chain needs 
                with dignity, transparency, and respect.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Who We Serve */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Who We Serve
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl bg-gradient-to-br from-orange-100 to-orange-200 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-6">🥘</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Street Food Vendors</h3>
                <p className="text-gray-700 leading-relaxed">
                  From pani puri wallahs to dosa masters, we serve vendors across India 
                  with reliable access to quality ingredients at fair prices.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-green-100 to-green-200 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-6">🏪</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Suppliers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We partner with wholesale dealers, farmers, and distributors to create 
                  direct supply channels that benefit everyone in the ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-blue-100 to-blue-200 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-6">🤝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">NGOs & Communities</h3>
                <p className="text-gray-700 leading-relaxed">
                  We collaborate with organizations working on livelihood development 
                  and financial inclusion for informal sector workers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}