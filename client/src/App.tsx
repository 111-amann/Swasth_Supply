import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useFirestore } from "@/hooks/use-firestore";
import { where } from "firebase/firestore";

import Home from "@/pages/home";
import ProductsPage from "@/pages/products";
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
      if (user && !userProfile && !profileLoading) {
        setProfileLoading(true);
        try {
          const profiles = await getDocuments("users", [
            where("firebaseUid", "==", user.uid),
          ]);
          if (profiles.length > 0) {
            setUserProfile(profiles[0]);
          } else {
            setUserProfile(null);
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          if (
            error.code === "permission-denied" ||
            error.code === "unavailable"
          ) {
            setUserProfile(null);
          }
        } finally {
          setProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user, userProfile, profileLoading, getDocuments]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && userProfile) {
    if (userProfile.userType === "vendor") {
      return <VendorDashboard userProfile={userProfile} />;
    } else if (userProfile.userType === "supplier") {
      return <SupplierDashboard userProfile={userProfile} />;
    }
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
