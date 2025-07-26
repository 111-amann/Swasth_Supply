import { useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function useFirestore() {
  const { toast } = useToast();

  const addDocument = async (collectionName: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error: any) {
      toast({
        title: "Error adding document",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDocument = async (collectionName: string, id: string, data: any) => {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      toast({
        title: "Error updating document",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error: any) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getDocument = async (collectionName: string, id: string) => {
    try {
      const docSnap = await getDoc(doc(db, collectionName, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error: any) {
      toast({
        title: "Error getting document",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getDocuments = async (collectionName: string, conditions?: any[]) => {
    try {
      let q = collection(db, collectionName);
      
      if (conditions && conditions.length > 0) {
        q = query(q, ...conditions) as any;
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error: any) {
      console.error("Firestore error:", error);
      if (error.code === "permission-denied") {
        toast({
          title: "Database access denied",
          description: "Please check your Firestore security rules",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error getting documents",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const useCollection = (collectionName: string, conditions?: any[]) => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let q = collection(db, collectionName);
      
      if (conditions && conditions.length > 0) {
        q = query(q, ...conditions) as any;
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocuments(docs);
        setLoading(false);
      }, (error) => {
        toast({
          title: "Error loading data",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      });

      return unsubscribe;
    }, [collectionName, JSON.stringify(conditions)]);

    return { documents, loading };
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    getDocuments,
    useCollection,
  };
}
