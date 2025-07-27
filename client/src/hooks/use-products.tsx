import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all products from Firestore
  const { data: products = [], isLoading: loading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch data from Firebase...");
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const products = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to Date if needed
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          };
        }) as Product[];
        
        console.log("Firebase data fetched:", products);
        return products;
      } catch (error) {
        console.error("Error fetching products from Firebase:", error);
        // Don't show toast here - let components handle the error state
        throw error; // Re-throw so React Query can handle it properly
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      try {
        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        
        toast({
          title: "Success",
          description: "Product created successfully!",
        });
        
        return { id: docRef.id, ...productData };
      } catch (error: any) {
        console.error("Error creating product:", error);
        toast({
          title: "Error",
          description: "Failed to create product in Firebase.",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, {
          ...data,
          updatedAt: Timestamp.now(),
        });
        
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
        
        return { id, ...data };
      } catch (error: any) {
        console.error("Error updating product:", error);
        toast({
          title: "Error",
          description: "Failed to update product in Firebase.",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteDoc(doc(db, "products", id));
        
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
        
        return id;
      } catch (error: any) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: "Failed to delete product from Firebase.",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const createProduct = async (productData: any) => {
    return createProductMutation.mutateAsync(productData);
  };

  const updateProduct = async (id: string, data: any) => {
    return updateProductMutation.mutateAsync({ id, data });
  };

  const deleteProduct = async (id: string) => {
    return deleteProductMutation.mutateAsync(id);
  };

  const getProductsBySupplierId = async (supplierId: string) => {
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("supplierId", "==", supplierId));
      const querySnapshot = await getDocs(q);
      
      const supplierProducts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        };
      }) as Product[];
      
      return supplierProducts;
    } catch (error: any) {
      console.error("Error fetching supplier products:", error);
      toast({
        title: "Error",
        description: "Failed to load your products from Firebase.",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsBySupplierId,
    isCreatingProduct: createProductMutation.isPending,
    isUpdatingProduct: updateProductMutation.isPending,
    isDeletingProduct: deleteProductMutation.isPending,
  };
}