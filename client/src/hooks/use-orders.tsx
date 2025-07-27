import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem } from "@shared/schema";
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

export function useOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all orders
  const {
    data: orders = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        console.log("Fetching orders from Firebase...");
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("orderDate", "desc"));
        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            orderDate: data.orderDate?.toDate ? data.orderDate.toDate() : data.orderDate,
            estimatedDelivery: data.estimatedDelivery?.toDate ? data.estimatedDelivery.toDate() : data.estimatedDelivery,
            actualDelivery: data.actualDelivery?.toDate ? data.actualDelivery.toDate() : data.actualDelivery,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          };
        }) as Order[];

        console.log("Fetched orders:", orders);
        return orders;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      vendorId: string;
      supplierId: string;
      items: OrderItem[];
      totalAmount: number;
      deliveryAddress: string;
      notes?: string;
      vendorName?: string;
      supplierName?: string;
    }) => {
      console.log("Creating order in Firebase:", orderData);
      
      const orderToCreate = {
        ...orderData,
        status: "pending",
        orderDate: Timestamp.now(),
        estimatedDelivery: null,
        actualDelivery: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderToCreate);
      console.log("Order created with ID:", docRef.id);

      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been sent to ${orderData.supplierName || 'the supplier'}.`,
      });

      return { id: docRef.id, ...orderToCreate };
    },
    onError: (error: any) => {
      console.error("Error creating order:", error);
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      console.log("Order created successfully, cache invalidated");
    },
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes, estimatedDelivery }: { 
      id: string; 
      status: string; 
      notes?: string;
      estimatedDelivery?: Date;
    }) => {
      console.log("Updating order status:", { id, status, notes });
      
      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (notes) {
        updateData.supplierNotes = notes;
      }

      if (estimatedDelivery) {
        updateData.estimatedDelivery = Timestamp.fromDate(estimatedDelivery);
      }

      if (status === "delivered") {
        updateData.actualDelivery = Timestamp.now();
      } else if (status === "confirmed") {
        // Set estimated delivery to 3 days from now if not provided
        if (!estimatedDelivery) {
          const threeDaysFromNow = new Date();
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          updateData.estimatedDelivery = Timestamp.fromDate(threeDaysFromNow);
        }
      }

      await updateDoc(doc(db, "orders", id), updateData);
      console.log("Order updated successfully");

      toast({
        title: "Order Updated",
        description: `Order status updated to ${status.charAt(0).toUpperCase() + status.slice(1)}.`,
      });

      return { id, status, ...updateData };
    },
    onError: (error: any) => {
      console.error("Error updating order:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      console.log("Order update successful, cache invalidated");
    },
  });

  return {
    orders,
    loading,
    error,
    createOrder: createOrderMutation.mutateAsync,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    isUpdatingOrder: updateOrderStatusMutation.isPending,
  };
}