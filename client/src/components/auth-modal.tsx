import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useFirestore } from "@/hooks/use-firestore";
import { Utensils, Truck, Store, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserType?: "vendor" | "supplier";
  defaultMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultUserType, defaultMode = "login" }: AuthModalProps) {
  const [userType, setUserType] = useState<"vendor" | "supplier" | "">(defaultUserType || "");
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    location: "",
    businessName: "",
    businessAddress: "",
    businessDescription: "",
    deliveryRadius: 5,
  });

  const { signIn, signUp, user } = useAuth();
  const { addDocument } = useFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) return;

    setLoading(true);
    try {
      let firebaseUser;
      
      if (mode === "signup") {
        firebaseUser = await signUp(formData.email, formData.password);
        
        if (firebaseUser) {
          // Only try to create profile if signup succeeded
          try {
            await addDocument("users", {
              firebaseUid: firebaseUser.uid,
              email: formData.email,
              fullName: formData.fullName,
              phone: formData.phone,
              userType,
              location: formData.location,
              businessName: formData.businessName || null,
              businessAddress: formData.businessAddress || null,
              businessDescription: formData.businessDescription || null,
              deliveryRadius: userType === "supplier" ? formData.deliveryRadius : null,
              isVerified: false,
            });
          } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
            // Continue anyway since user was created successfully
          }
          onClose();
        }
      } else {
        firebaseUser = await signIn(formData.email, formData.password);
        if (firebaseUser) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      fullName: "",
      phone: "",
      location: "",
      businessName: "",
      businessAddress: "",
      businessDescription: "",
      deliveryRadius: 5,
    });
  };

  const handleUserTypeSelect = (type: "vendor" | "supplier") => {
    setUserType(type);
    resetForm();
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {!userType ? "Welcome to Swasth Supply" : 
             mode === "login" ? `Login as ${userType === "vendor" ? "Vendor" : "Supplier"}` :
             `Sign Up as ${userType === "vendor" ? "Vendor" : "Supplier"}`}
          </DialogTitle>
        </DialogHeader>

        {!userType ? (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">Choose your account type</p>
            
            <Button
              onClick={() => handleUserTypeSelect("vendor")}
              variant="outline"
              className="w-full p-6 h-auto flex items-center justify-start space-x-4 hover:bg-orange-50 hover:border-primary"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Utensils className="text-white" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Street Food Vendor</h3>
                <p className="text-sm text-muted-foreground">Buy raw materials</p>
              </div>
            </Button>

            <Button
              onClick={() => handleUserTypeSelect("supplier")}
              variant="outline"
              className="w-full p-6 h-auto flex items-center justify-start space-x-4 hover:bg-green-50 hover:border-secondary"
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Truck className="text-white" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Raw Material Supplier</h3>
                <p className="text-sm text-muted-foreground">Sell to vendors</p>
              </div>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {mode === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter your city"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder={userType === "vendor" ? "Your stall name" : "Your business name"}
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    placeholder="Enter your complete business address"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  />
                </div>

                {userType === "supplier" && (
                  <>
                    <div>
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        placeholder="Describe your business and specialties"
                        value={formData.businessDescription}
                        onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                      <Select
                        value={formData.deliveryRadius.toString()}
                        onValueChange={(value) => setFormData({ ...formData, deliveryRadius: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Within 5km</SelectItem>
                          <SelectItem value="10">Within 10km</SelectItem>
                          <SelectItem value="20">Within 20km</SelectItem>
                          <SelectItem value="50">Entire City</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}

            <Button 
              type="submit" 
              className={`w-full ${userType === "vendor" ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90"}`}
              disabled={loading}
            >
              {loading ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
            </Button>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="link"
                onClick={toggleMode}
                className="text-primary"
              >
                {mode === "login" ? "Create account" : "Already have account? Login"}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setUserType("")}
                className="text-muted-foreground"
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
