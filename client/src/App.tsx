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
import VendorDashboard from "@/pages/vendor-dashboard";
import SupplierDashboard from "@/pages/supplier-dashboard";
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
            where("firebaseUid", "==", user.uid)
          ]);
          if (profiles.length > 0) {
            setUserProfile(profiles[0]);
          } else {
            // If no profile found, don't set a profile - let user create one
            setUserProfile(null);
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          // If Firestore is not accessible, don't create a profile
          if (error.code === "permission-denied" || error.code === "unavailable") {
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

  // If user is authenticated and has a profile, show appropriate dashboard
  if (user && userProfile) {
    if (userProfile.userType === "vendor") {
      return <VendorDashboard userProfile={userProfile} />;
    } else if (userProfile.userType === "supplier") {
      return <SupplierDashboard userProfile={userProfile} />;
    }
  }

  // Show home page for unauthenticated users or users without profiles
  return (
    <Switch>
      <Route path="/" component={Home} />
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
