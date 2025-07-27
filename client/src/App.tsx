import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useFirestore } from "@/hooks/use-firestore";
import { where } from "firebase/firestore";

import Home from "@/pages/home";
import ProductsPage from "@/pages/products.tsx";
import VendorDashboard from "@/pages/vendor-dashboard";
import SupplierDashboard from "@/pages/supplier-dashboard";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";

import Support from "@/pages/support";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, loading } = useAuth();
  const { getDocuments } = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !userProfile) {
        setProfileLoading(true);
        try {
          console.log("Fetching user profile for:", user.uid);
          const profiles = await getDocuments("users", [
            where("firebaseUid", "==", user.uid),
          ]);
          console.log("Found profiles:", profiles);
          
          if (profiles.length > 0) {
            const profile = profiles[0];
            console.log("Profile found:", profile);
            console.log("User type in profile:", profile.userType);
            setUserProfile(profile);
          } else {
            console.log("No profile found - user needs to register first");
            setUserProfile(null);
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          console.log("Profile fetch failed - user needs to register");
          setUserProfile(null);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user, getDocuments]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Debug logging for authentication routing
  console.log("Auth Debug:", {
    user: user?.uid,
    userProfile,
    userType: userProfile?.userType,
    hasUser: !!user,
    hasProfile: !!userProfile
  });

  if (user && userProfile && userProfile.userType) {
    console.log("🔄 Routing based on userType:", userProfile.userType);
    
    if (userProfile.userType === "vendor") {
      console.log("✅ Routing to VENDOR Dashboard for user:", user.uid);
      return <VendorDashboard userProfile={userProfile} />;
    } 
    
    if (userProfile.userType === "supplier") {
      console.log("✅ Routing to SUPPLIER Dashboard for user:", user.uid);
      return <SupplierDashboard userProfile={userProfile} />;
    }
    
    console.log("❌ Unknown userType:", userProfile.userType);
  }

  // If user is logged in but no profile exists, they need to complete registration
  if (user && !profileLoading && (!userProfile || !userProfile.userType)) {
    console.log("User logged in but no profile or userType - showing home for registration");
    // User is authenticated but hasn't completed registration
    // Let them access the home page to register as vendor or supplier
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />

      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
