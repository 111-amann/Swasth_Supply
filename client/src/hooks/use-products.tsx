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

  // Fetch all products
  const {
    data: products = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        console.log("Fetching products from Firebase...");
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          };
        }) as Product[];

        console.log("Fetched products:", products);
        return products;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Let React Query handle error state
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
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
    },
    onError: (error: any) => {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product in Firebase.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await updateDoc(doc(db, "products", id), {
        ...data,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });

      return { id, ...data };
    },
    onError: (error: any) => {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product in Firebase.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "products", id));

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });

      return id;
    },
    onError: (error: any) => {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product from Firebase.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const createProduct = async (productData: any) =>
    createProductMutation.mutateAsync(productData);

  const updateProduct = async (id: string, data: any) =>
    updateProductMutation.mutateAsync({ id, data });

  const deleteProduct = async (id: string) =>
    deleteProductMutation.mutateAsync(id);

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
