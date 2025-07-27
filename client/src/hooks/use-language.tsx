import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.howItWorks': 'How it Works',
    'nav.support': 'Support',
    'nav.products': 'Products',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.vendorDashboard': 'Vendor Dashboard',
    'nav.supplierDashboard': 'Supplier Dashboard',
    
    // Home Page
    'home.hero.title': 'Connect Street Food Vendors with Local Suppliers',
    'home.hero.subtitle': 'The fastest way to get fresh ingredients and supplies for your street food business in India',
    'home.hero.vendorButton': 'I\'m a Vendor',
    'home.hero.supplierButton': 'I\'m a Supplier',
    'home.hero.searchPlaceholder': 'Search for suppliers in your city...',
    'home.hero.searchButton': 'Search',
    
    'home.stats.vendors': 'Active Vendors',
    'home.stats.suppliers': 'Verified Suppliers',
    'home.stats.orders': 'Orders Delivered',
    'home.stats.cities': 'Cities Covered',
    
    'home.features.title': 'Why Choose StreetSupply?',
    'home.features.subtitle': 'Everything you need to grow your street food business',
    'home.features.local.title': 'Local Suppliers',
    'home.features.local.desc': 'Find verified suppliers in your neighborhood for fresh ingredients',
    'home.features.pricing.title': 'Best Prices',
    'home.features.pricing.desc': 'Competitive wholesale prices with no hidden charges',
    'home.features.delivery.title': 'Quick Delivery',
    'home.features.delivery.desc': 'Same-day delivery for orders placed before 2 PM',
    'home.features.payment.title': 'Flexible Payment',
    'home.features.payment.desc': 'Pay cash on delivery or use UPI for instant payments',
    'home.features.quality.title': 'Quality Assured',
    'home.features.quality.desc': 'All suppliers are verified and products are quality checked',
    'home.features.support.title': '24/7 Support',
    'home.features.support.desc': 'Get help anytime through WhatsApp or phone support',
    
    'home.categories.title': 'Popular Categories',
    'home.categories.subtitle': 'Find exactly what you need for your street food business',
    'home.categories.vegetables': 'Fresh Vegetables',
    'home.categories.spices': 'Spices & Masalas',
    'home.categories.rice': 'Rice & Grains',
    'home.categories.oil': 'Cooking Oil',
    'home.categories.dairy': 'Dairy Products',
    'home.categories.packaging': 'Packaging Materials',
    
    'home.testimonials.title': 'What Our Vendors Say',
    'home.testimonials.subtitle': 'Success stories from street food vendors across India',
    
    'home.cta.title': 'Ready to Transform Your Business?',
    'home.cta.subtitle': 'Join thousands of vendors already using StreetSupply',
    'home.cta.button': 'Get Started Today',
    
    // Footer
    'footer.tagline': 'Connecting street food vendors with quality suppliers across India',
    'footer.quickLinks': 'Quick Links',
    'footer.support': 'Support',
    'footer.whatsapp': 'WhatsApp Support',
    'footer.email': 'Email Support',
    'footer.phone': 'Phone Support',
    'footer.copyright': '© 2025 StreetSupply. All rights reserved.',
    
    // Support Page
    'support.hero.title': 'How Can We Help You?',
    'support.hero.subtitle': 'Get instant support through WhatsApp, phone, or email',
    'support.whatsapp': 'WhatsApp Support',
    'support.whatsappDesc': 'Chat with our team instantly',
    'support.phone': 'Call Support',
    'support.phoneDesc': 'Speak directly with our experts',
    'support.email': 'Email Support',
    'support.emailDesc': 'Send detailed queries',
    'support.faq.title': 'Frequently Asked Questions',
    'support.hours.title': 'Support Hours',
    'support.hours.whatsappPhone': 'WhatsApp & Phone',
    'support.hours.mondaySaturday': 'Monday - Saturday',
    'support.hours.timing1': '8:00 AM - 8:00 PM',
    'support.hours.emailSupport': 'Email Support',
    'support.hours.response': '24/7 Response',
    'support.hours.within24': 'Within 24 hours',
    'support.hours.emergency': 'Emergency Orders',
    'support.hours.whatsappAvailable': 'WhatsApp Available',
    'support.hours.sundayTiming': 'Sunday 10 AM - 6 PM',
    
    // About Page
    'about.hero.title': 'About StreetSupply',
    'about.hero.subtitle': 'Empowering local vendors to access raw materials easily and affordably',
    'about.mission.title': 'Our Mission',
    'about.mission.text': 'To bridge the gap between street food vendors and reliable suppliers, creating a digital marketplace that ensures fresh ingredients, fair pricing, and consistent supply for India\'s vibrant street food ecosystem.',
    'about.vision.title': 'Our Vision',
    'about.challenge.title': 'The Challenge We\'re Solving',
    
    // How it works page
    'howitworks.hero.title': 'How StreetSupply Works',
    'howitworks.hero.subtitle': 'Simple steps to connect vendors with suppliers across India',
    'howitworks.vendors.title': 'For Street Food Vendors',
    'howitworks.vendors.subtitle': 'Get fresh ingredients delivered to your doorstep',
    'howitworks.suppliers.title': 'For Suppliers',
    'howitworks.suppliers.subtitle': 'Reach thousands of vendors in your area',
    'about.vision.text': 'To become India\'s largest B2B marketplace for street food vendors, supporting local businesses and promoting food safety.',
    'about.values.title': 'Our Values',
    'about.values.trust': 'Trust & Transparency',
    'about.values.quality': 'Quality First',
    'about.values.support': 'Customer Support',
    'about.values.innovation': 'Innovation',
    
    // How It Works
    'howItWorks.title': 'How StreetSupply Works',
    'howItWorks.subtitle': 'Simple steps to get fresh supplies for your business',
    'howItWorks.vendors.title': 'For Vendors',
    'howItWorks.vendors.step1': 'Sign up as a vendor',
    'howItWorks.vendors.step2': 'Browse local suppliers',
    'howItWorks.vendors.step3': 'Place your orders',
    'howItWorks.vendors.step4': 'Get delivery at your stall',
    'howItWorks.suppliers.title': 'For Suppliers',
    'howItWorks.suppliers.step1': 'Register as a supplier',
    'howItWorks.suppliers.step2': 'List your products',
    'howItWorks.suppliers.step3': 'Receive orders',
    'howItWorks.suppliers.step4': 'Deliver to vendors',
  },
  hi: {
    // Header
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.howItWorks': 'यह कैसे काम करता है',
    'nav.support': 'सहायता',
    'nav.products': 'उत्पाद',
    'nav.login': 'लॉग इन',
    'nav.signup': 'साइन अप',
    'nav.vendorDashboard': 'विक्रेता डैशबोर्ड',
    'nav.supplierDashboard': 'आपूर्तिकर्ता डैशबोर्ड',
    
    // Home Page
    'home.hero.title': 'स्ट्रीट फूड विक्रेताओं को स्थानीय आपूर्तिकर्ताओं से जोड़ें',
    'home.hero.subtitle': 'भारत में अपने स्ट्रीट फूड व्यवसाय के लिए ताज़ी सामग्री और आपूर्ति पाने का सबसे तेज़ तरीका',
    'home.hero.vendorButton': 'मैं एक विक्रेता हूँ',
    'home.hero.supplierButton': 'मैं एक आपूर्तिकर्ता हूँ',
    'home.hero.searchPlaceholder': 'अपने शहर में आपूर्तिकर्ता खोजें...',
    'home.hero.searchButton': 'खोजें',
    
    'home.stats.vendors': 'सक्रिय विक्रेता',
    'home.stats.suppliers': 'सत्यापित आपूर्तिकर्ता',
    'home.stats.orders': 'डिलीवर किए गए ऑर्डर',
    'home.stats.cities': 'शहरों में सेवा',
    
    'home.features.title': 'StreetSupply क्यों चुनें?',
    'home.features.subtitle': 'अपने स्ट्रीट फूड व्यवसाय को बढ़ाने के लिए आवश्यक सब कुछ',
    'home.features.local.title': 'स्थानीय आपूर्तिकर्ता',
    'home.features.local.desc': 'ताज़ी सामग्री के लिए अपने आस-पास के सत्यापित आपूर्तिकर्ता खोजें',
    'home.features.pricing.title': 'सबसे अच्छी कीमतें',
    'home.features.pricing.desc': 'बिना छिपे शुल्क के प्रतिस्पर्धी थोक मूल्य',
    'home.features.delivery.title': 'त्वरित डिलीवरी',
    'home.features.delivery.desc': 'दोपहर 2 बजे से पहले दिए गए ऑर्डर की समान दिन डिलीवरी',
    'home.features.payment.title': 'लचीला भुगतान',
    'home.features.payment.desc': 'डिलीवरी पर नकद भुगतान या तुरंत भुगतान के लिए UPI का उपयोग करें',
    'home.features.quality.title': 'गुणवत्ता आश्वासन',
    'home.features.quality.desc': 'सभी आपूर्तिकर्ता सत्यापित हैं और उत्पादों की गुणवत्ता जांची गई है',
    'home.features.support.title': '24/7 सहायता',
    'home.features.support.desc': 'WhatsApp या फोन सहायता के माध्यम से कभी भी मदद प्राप्त करें',
    
    'home.categories.title': 'लोकप्रिय श्रेणियां',
    'home.categories.subtitle': 'अपने स्ट्रीट फूड व्यवसाय के लिए वही खोजें जिसकी आपको आवश्यकता है',
    'home.categories.vegetables': 'ताज़ी सब्जियां',
    'home.categories.spices': 'मसाले और गरम मसाला',
    'home.categories.rice': 'चावल और अनाज',
    'home.categories.oil': 'खाना पकाने का तेल',
    'home.categories.dairy': 'डेयरी उत्पाद',
    'home.categories.packaging': 'पैकेजिंग सामग्री',
    
    'home.testimonials.title': 'हमारे विक्रेता क्या कहते हैं',
    'home.testimonials.subtitle': 'भारत भर के स्ट्रीट फूड विक्रेताओं की सफलता की कहानियां',
    
    'home.cta.title': 'अपने व्यवसाय को बदलने के लिए तैयार हैं?',
    'home.cta.subtitle': 'हजारों विक्रेता पहले से ही StreetSupply का उपयोग कर रहे हैं',
    'home.cta.button': 'आज ही शुरू करें',
    
    // Footer
    'footer.tagline': 'भारत भर में स्ट्रीट फूड विक्रेताओं को गुणवत्तापूर्ण आपूर्तिकर्ताओं से जोड़ना',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.support': 'सहायता',
    'footer.whatsapp': 'WhatsApp सहायता',
    'footer.email': 'ईमेल सहायता',
    'footer.phone': 'फोन सहायता',
    'footer.copyright': '© 2025 StreetSupply. सभी अधिकार सुरक्षित।',
    
    // Support Page
    'support.hero.title': 'हम आपकी कैसे मदद कर सकते हैं?',
    'support.hero.subtitle': 'WhatsApp, फोन या ईमेल के माध्यम से तुरंत सहायता प्राप्त करें',
    'support.whatsapp': 'WhatsApp सहायता',
    'support.whatsappDesc': 'हमारी टीम से तुरंत चैट करें',
    'support.phone': 'कॉल सहायता',
    'support.phoneDesc': 'हमारे विशेषज्ञों से सीधे बात करें',
    'support.email': 'ईमेल सहायता',
    'support.emailDesc': 'विस्तृत प्रश्न भेजें',
    'support.faq.title': 'अक्सर पूछे जाने वाले प्रश्न',
    'support.hours.title': 'सहायता के घंटे',
    'support.hours.whatsappPhone': 'WhatsApp और फोन',
    'support.hours.mondaySaturday': 'सोमवार - शनिवार',
    'support.hours.timing1': 'सुबह 8:00 - रात 8:00',
    'support.hours.emailSupport': 'ईमेल सहायता',
    'support.hours.response': '24/7 प्रतिक्रिया',
    'support.hours.within24': '24 घंटे के भीतर',
    'support.hours.emergency': 'आपातकालीन ऑर्डर',
    'support.hours.whatsappAvailable': 'WhatsApp उपलब्ध',
    'support.hours.sundayTiming': 'रविवार सुबह 10 - शाम 6',
    
    // About Page
    'about.hero.title': 'StreetSupply के बारे में',
    'about.hero.subtitle': 'स्थानीय विक्रेताओं को कच्चे माल तक आसानी से और किफायती पहुंच प्रदान करना',
    'about.challenge.title': 'हम जो चुनौती हल कर रहे हैं',
    
    // How it works page
    'howitworks.hero.title': 'StreetSupply कैसे काम करता है',
    'howitworks.hero.subtitle': 'भारत भर में विक्रेताओं को आपूर्तिकर्ताओं से जोड़ने के सरल कदम',
    'howitworks.vendors.title': 'स्ट्रीट फूड विक्रेताओं के लिए',
    'howitworks.vendors.subtitle': 'अपने दरवाजे पर ताज़ी सामग्री पहुंचाएं',
    'howitworks.suppliers.title': 'आपूर्तिकर्ताओं के लिए',
    'howitworks.suppliers.subtitle': 'अपने क्षेत्र में हजारों विक्रेताओं तक पहुंचें',
    'about.mission.title': 'हमारा मिशन',
    'about.mission.text': 'स्ट्रीट फूड विक्रेताओं और गुणवत्तापूर्ण आपूर्तिकर्ताओं के बीच की खाई को पाटना, सभी के लिए ताज़ी सामग्री को सुलभ और किफायती बनाना।',
    'about.vision.title': 'हमारी दृष्टि',
    'about.vision.text': 'स्ट्रीट फूड विक्रेताओं के लिए भारत का सबसे बड़ा B2B मार्केटप्लेस बनना, स्थानीय व्यवसायों का समर्थन करना और खाद्य सुरक्षा को बढ़ावा देना।',
    'about.values.title': 'हमारे मूल्य',
    'about.values.trust': 'विश्वास और पारदर्शिता',
    'about.values.quality': 'गुणवत्ता पहले',
    'about.values.support': 'ग्राहक सहायता',
    'about.values.innovation': 'नवाचार',
    
    // How It Works
    'howItWorks.title': 'StreetSupply कैसे काम करता है',
    'howItWorks.subtitle': 'अपने व्यवसाय के लिए ताज़ी आपूर्ति पाने के सरल चरण',
    'howItWorks.vendors.title': 'विक्रेताओं के लिए',
    'howItWorks.vendors.step1': 'एक विक्रेता के रूप में साइन अप करें',
    'howItWorks.vendors.step2': 'स्थानीय आपूर्तिकर्ताओं को ब्राउज़ करें',
    'howItWorks.vendors.step3': 'अपने ऑर्डर दें',
    'howItWorks.vendors.step4': 'अपने स्टॉल पर डिलीवरी प्राप्त करें',
    'howItWorks.suppliers.title': 'आपूर्तिकर्ताओं के लिए',
    'howItWorks.suppliers.step1': 'एक आपूर्तिकर्ता के रूप में पंजीकरण करें',
    'howItWorks.suppliers.step2': 'अपने उत्पादों को सूचीबद्ध करें',
    'howItWorks.suppliers.step3': 'ऑर्डर प्राप्त करें',
    'howItWorks.suppliers.step4': 'विक्रेताओं को डिलीवर करें',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}