import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFirestore } from "@/hooks/use-firestore";
import { Users, Truck } from "lucide-react";

interface ProfileCreatorProps {
  userType: "vendor" | "supplier";
  buttonText: string;
  buttonClassName?: string;
}

export function ProfileCreator({ userType, buttonText, buttonClassName }: ProfileCreatorProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addDocument } = useFirestore();

  const handleCreateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await addDocument("users", {
        firebaseUid: user.uid,
        email: user.email || "",
        fullName: user.displayName || user.email?.split('@')[0] || "User",
        phone: "",
        userType,
        location: "",
        businessName: "",
        businessAddress: "",
        businessDescription: "",
        deliveryRadius: userType === "supplier" ? 5 : null,
        isVerified: false,
      });
      
      // Refresh page to trigger profile reload
      window.location.reload();
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      className={buttonClassName}
      onClick={handleCreateProfile}
      disabled={loading}
    >
      {userType === "vendor" ? <Users className="mr-2" size={20} /> : <Truck className="mr-2" size={20} />}
      {loading ? "Creating Profile..." : buttonText}
    </Button>
  );
}