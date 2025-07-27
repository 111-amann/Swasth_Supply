import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addSampleProducts } from "@/lib/sample-data";
import { Database, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddSampleData() {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddSampleData = async () => {
    setIsAdding(true);
    try {
      await addSampleProducts();
      toast({
        title: "Success!",
        description: "Sample products have been added to Firebase database.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add sample products: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sample Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Add sample products to your Firebase database to test the application.
        </p>
        <Button 
          onClick={handleAddSampleData}
          disabled={isAdding}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? "Adding..." : "Add Sample Products"}
        </Button>
      </CardContent>
    </Card>
  );
}