import { useState, useEffect } from "react";
import { Order } from "@shared/schema";
import { 
  collection, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useRealtimeOrders(userId?: string, userType?: 'vendor' | 'supplier') {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !userType) {
      setLoading(false);
      return;
    }

    console.log("Setting up realtime listener for:", { userId, userType });

    const ordersRef = collection(db, "orders");
    const field = userType === 'vendor' ? 'vendorId' : 'supplierId';
    
    const q = query(
      ordersRef, 
      where(field, "==", userId),
      orderBy("orderDate", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        console.log("Realtime orders update received:", snapshot.size, "orders");
        
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            orderDate: data.orderDate?.toDate ? data.orderDate.toDate() : data.orderDate,
            estimatedDelivery: data.estimatedDelivery?.toDate ? data.estimatedDelivery.toDate() : data.estimatedDelivery,
            actualDelivery: data.actualDelivery?.toDate ? data.actualDelivery.toDate() : data.actualDelivery,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          } as Order;
        });

        setOrders(ordersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in realtime orders listener:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up realtime orders listener");
      unsubscribe();
    };
  }, [userId, userType]);

  return { orders, loading, error };
}