import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Database } from "lucide-react";

export function FirebaseDataViewer() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFirebaseData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting to fetch data from Firebase...");
      const productsRef = collection(db, "products");
      const q = query(productsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log("Firebase data fetched:", fetchedProducts);
      setProducts(fetchedProducts);
      
      if (fetchedProducts.length === 0) {
        setError("No products found in Firebase database");
        toast({
          title: "No Data",
          description: "Firebase database is empty. Please add products first.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Found ${fetchedProducts.length} products in Firebase`,
        });
      }
    } catch (error: any) {
      console.error("Firebase error:", error);
      setError(`Firebase Error: ${error.message}`);
      toast({
        title: "Firebase Connection Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirebaseData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Firebase Data Status
          </span>
          <Button
            onClick={fetchFirebaseData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-4">
            <p>Loading Firebase data...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 p-4 bg-red-50 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div>
            <p className="text-green-600 font-semibold mb-2">
              ✓ Firebase Connected - {products.length} products found
            </p>
            {products.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {products.map((product, index) => (
                  <div key={product.id} className="text-sm p-2 bg-gray-50 rounded">
                    <strong>{index + 1}. {product.name}</strong>
                    <br />
                    <span className="text-muted-foreground">
                      Category: {product.category} | Price: ₹{product.price} | Supplier: {product.supplierName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}