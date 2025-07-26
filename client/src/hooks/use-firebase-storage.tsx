import { useState } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { storage, auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "react-firebase-hooks/auth";

export function useFirebaseStorage() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [user] = useAuthState(auth);

  const uploadImage = async (file: File, folder: string = "products"): Promise<string> => {
    if (!file) {
      throw new Error("No file provided");
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload images.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      throw new Error("File size must be less than 5MB");
    }

    setUploading(true);

    try {
      // Create unique filename with user ID for better organization
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${user.uid}_${timestamp}_${sanitizedName}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      console.log("Starting upload to:", `${folder}/${fileName}`);

      // Upload file with metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: user.uid,
          uploadedAt: new Date().toISOString(),
        }
      };

      const snapshot = await uploadBytes(storageRef, file, metadata);
      console.log("File uploaded successfully:", snapshot.metadata.name);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL obtained:", downloadURL);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      return downloadURL;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      
      // Better error messages based on error codes
      let errorMessage = "Failed to upload image. Please try again.";
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = "You don't have permission to upload files. Please check your account.";
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = "Storage quota exceeded. Please contact support.";
      } else if (error.code === 'storage/invalid-format') {
        errorMessage = "Invalid file format. Please use JPG, PNG, or GIF.";
      } else if (error.code === 'storage/invalid-argument') {
        errorMessage = "Invalid file. Please try a different image.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
      if (!pathMatch) {
        throw new Error("Invalid image URL");
      }

      const filePath = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, filePath);

      await deleteObject(imageRef);
      console.log("Image deleted successfully");

      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete image.",
        variant: "destructive", 
      });
      throw error;
    }
  };

  // Fallback upload to local server if Firebase fails
  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    console.log("Uploading to server endpoint:", '/api/upload');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload to server');
    }

    const result = await response.json();
    console.log("Server upload successful:", result);
    return `${window.location.origin}${result.imageUrl}`;
  };

  // Enhanced upload with fallback
  const uploadImageWithFallback = async (file: File, folder: string = "products"): Promise<string> => {
    setUploading(true);
    
    try {
      // Skip Firebase and go directly to server upload for now to fix the loading issue
      console.log("Using server upload directly to avoid Firebase authentication issues...");
      
      toast({
        title: "Uploading image",
        description: "Processing your image...",
      });
      
      const serverUrl = await uploadToServer(file);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
      
      return serverUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Save image metadata to Firestore
  const saveImageToFirestore = async (imageUrl: string, metadata: any) => {
    if (!user) return null;

    try {
      const imageData = {
        url: imageUrl,
        uploadedBy: user.uid,
        uploadedAt: new Date().toISOString(),
        fileName: metadata.fileName || 'unknown',
        fileSize: metadata.fileSize || 0,
        fileType: metadata.fileType || 'image',
        ...metadata
      };

      const docRef = await addDoc(collection(db, 'images'), imageData);
      console.log("Image metadata saved to Firestore:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      // Don't throw error here, just log it since the upload was successful
      return null;
    }
  };

  // Enhanced upload that saves to both storage and database
  const uploadImageWithDatabase = async (file: File, folder: string = "products", extraMetadata: any = {}): Promise<{url: string, firestoreId?: string}> => {
    setUploading(true);
    
    try {
      // Upload the file first
      console.log("Using server upload directly to avoid Firebase authentication issues...");
      
      toast({
        title: "Uploading image",
        description: "Processing your image...",
      });
      
      const imageUrl = await uploadToServer(file);
      
      // Save metadata to Firestore
      const metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder,
        ...extraMetadata
      };
      
      const firestoreId = await saveImageToFirestore(imageUrl, metadata);
      
      toast({
        title: "Success",
        description: "Image uploaded and saved to database!",
      });
      
      return { url: imageUrl, firestoreId: firestoreId || undefined };
    } catch (error) {
      console.error("Upload failed:", error);
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage: uploadImageWithFallback,
    uploadImageWithDatabase,
    uploadImageFirebase: uploadImage,
    uploadImageServer: uploadToServer,
    saveImageToFirestore,
    deleteImage,
    uploading,
  };
}