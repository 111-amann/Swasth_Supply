import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addSampleProducts } from "@/lib/sample-data";
import { useToast } from "@/hooks/use-toast";

export function AddSampleData() {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddSampleProducts = async () => {
    setIsAdding(true);
    try {
      await addSampleProducts();
      toast({
        title: "Success!",
        description: "Sample products have been added to the database.",
      });
    } catch (error) {
      console.error("Error adding sample products:", error);
      toast({
        title: "Error",
        description: "Failed to add sample products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button 
      onClick={handleAddSampleProducts} 
      disabled={isAdding}
      className="bg-orange-600 hover:bg-orange-700"
    >
      {isAdding ? "Adding..." : "Add Sample Products"}
    </Button>
  );
}