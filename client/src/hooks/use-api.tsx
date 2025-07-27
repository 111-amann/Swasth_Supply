import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// API client for Swasth Supply backend
export function useApi() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      setLoading(true);
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('API request failed:', error);
      toast({
        title: "API Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserByFirebaseUid = async (firebaseUid: string) => {
    return apiRequest(`/users/firebase/${firebaseUid}`);
  };

  const createUser = async (userData: any) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };

  const getProducts = async (filters?: any) => {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiRequest(`/products${params}`);
  };

  const getOrders = async (filters?: any) => {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiRequest(`/orders${params}`);
  };

  return {
    loading,
    getUserByFirebaseUid,
    createUser,
    getProducts,
    getOrders,
    apiRequest,
  };
}