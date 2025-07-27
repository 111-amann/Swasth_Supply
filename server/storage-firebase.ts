import { 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type Order, 
  type InsertOrder,
  type Review, 
  type InsertReview,
  users,
  products,
  orders,
  reviews
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface for Firebase-only implementation
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  
  // Product operations - All handled by Firebase
  getProduct(id: string): Promise<Product | undefined>;
  getProducts(filters?: {
    category?: string;
    location?: string;
    supplierId?: string;
  }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  
  // Order operations
  getOrder(id: string): Promise<Order | undefined>;
  getOrders(filters?: {
    vendorId?: string;
    supplierId?: string;
    status?: string;
  }): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<void>;
  
  // Review operations
  getReview(id: string): Promise<Review | undefined>;
  getReviews(filters?: {
    supplierId?: string;
    vendorId?: string;
  }): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<void>;
}

export class FirebaseStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    
    // No sample data - using Firebase Firestore for all product data
    // Users and orders can use PostgreSQL if needed
  }

  // User operations - using PostgreSQL
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching user by firebase UID:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await db.delete(users).where(eq(users.id, id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  // Product operations - All Firebase only, no local data
  async getProduct(id: string): Promise<Product | undefined> {
    // Products are handled entirely by Firebase
    // This method should not be used since frontend directly accesses Firebase
    return undefined;
  }

  async getProducts(filters?: {
    category?: string;
    location?: string;
    supplierId?: string;
  }): Promise<Product[]> {
    // Products are handled entirely by Firebase
    // This method should not be used since frontend directly accesses Firebase
    return [];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // Products are handled entirely by Firebase
    // This method should not be used since frontend directly accesses Firebase
    throw new Error("Products are managed through Firebase - use frontend Firebase hooks");
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    // Products are handled entirely by Firebase
    // This method should not be used since frontend directly accesses Firebase
    return undefined;
  }

  async deleteProduct(id: string): Promise<void> {
    // Products are handled entirely by Firebase
    // This method should not be used since frontend directly accesses Firebase
  }

  // Order operations
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(filters?: {
    vendorId?: string;
    supplierId?: string;
    status?: string;
  }): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    
    if (filters?.vendorId) {
      orders = orders.filter(o => o.vendorId === filters.vendorId);
    }
    
    if (filters?.supplierId) {
      orders = orders.filter(o => o.supplierId === filters.supplierId);
    }
    
    if (filters?.status) {
      orders = orders.filter(o => o.status === filters.status);
    }
    
    return orders.sort((a, b) => (b.orderDate?.getTime() ?? 0) - (a.orderDate?.getTime() ?? 0));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      estimatedDelivery: insertOrder.estimatedDelivery ?? null,
      actualDelivery: insertOrder.actualDelivery ?? null,
      notes: insertOrder.notes ?? null,
      orderDate: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    this.orders.delete(id);
  }

  // Review operations
  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviews(filters?: {
    supplierId?: string;
    vendorId?: string;
  }): Promise<Review[]> {
    let reviews = Array.from(this.reviews.values());
    
    if (filters?.supplierId) {
      reviews = reviews.filter(r => r.supplierId === filters.supplierId);
    }
    
    if (filters?.vendorId) {
      reviews = reviews.filter(r => r.vendorId === filters.vendorId);
    }
    
    return reviews.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id,
      comment: insertReview.comment ?? null,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updatedReview = { ...review, ...updates };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: string): Promise<void> {
    this.reviews.delete(id);
  }
}

// Export singleton instance
export const storage = new FirebaseStorage();