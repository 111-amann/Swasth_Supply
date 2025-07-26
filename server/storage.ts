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

// Storage interface for Swasth Supply marketplace
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  
  // Product operations
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    
    // Initialize with some sample data for development
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample suppliers
    const supplier1: User = {
      id: "supplier1",
      firebaseUid: "firebase_supplier1",
      email: "shah@trading.com",
      fullName: "Mohan Shah",
      phone: "+91 9123456789",
      userType: "supplier",
      location: "Karol Bagh, Delhi",
      businessName: "Shah Trading Co.",
      businessAddress: "Shop 25, Wholesale Market, Karol Bagh, New Delhi - 110005",
      businessDescription: "We are a trusted supplier of premium quality raw materials for street food vendors. Specializing in spices, grains, and cooking oils with 15+ years of experience.",
      deliveryRadius: 10,
      isVerified: true,
      createdAt: new Date(),
    };

    const supplier2: User = {
      id: "supplier2",
      firebaseUid: "firebase_supplier2",
      email: "gupta@wholesale.com",
      fullName: "Rajesh Gupta",
      phone: "+91 9234567890",
      userType: "supplier",
      location: "Chandni Chowk, Delhi",
      businessName: "Gupta Wholesale",
      businessAddress: "Shop 15, Main Market, Chandni Chowk, Delhi - 110006",
      businessDescription: "Fresh vegetables and produce supplier with daily deliveries from Azadpur Mandi.",
      deliveryRadius: 15,
      isVerified: true,
      createdAt: new Date(),
    };

    // Sample vendor
    const vendor1: User = {
      id: "vendor1",
      firebaseUid: "firebase_vendor1",
      email: "raj@puchka.com",
      fullName: "Raj Kumar",
      phone: "+91 9876543210",
      userType: "vendor",
      location: "Connaught Place, Delhi",
      businessName: "Raj's Puchka Corner",
      businessAddress: "Shop 12, Block A, Connaught Place, New Delhi - 110001",
      businessDescription: null,
      deliveryRadius: null,
      isVerified: true,
      createdAt: new Date(),
    };

    this.users.set(supplier1.id, supplier1);
    this.users.set(supplier2.id, supplier2);
    this.users.set(vendor1.id, vendor1);

    // Sample products
    const products: Product[] = [
      {
        id: "prod1",
        supplierId: "supplier1",
        name: "Garam Masala Powder",
        description: "Premium quality blend of authentic Indian spices",
        category: "spices",
        price: "450.00",
        unit: "kg",
        stockQuantity: 150,
        minimumOrder: 1,
        deliveryTime: "same-day",
        imageUrl: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod2",
        supplierId: "supplier1",
        name: "Premium Basmati Rice",
        description: "Long grain aromatic basmati rice, Grade A quality",
        category: "rice",
        price: "1250.00",
        unit: "25kg bag",
        stockQuantity: 500,
        minimumOrder: 1,
        deliveryTime: "same-day",
        imageUrl: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod3",
        supplierId: "supplier1",
        name: "Refined Cooking Oil",
        description: "Pure sunflower oil, heart healthy and light",
        category: "oil",
        price: "1800.00",
        unit: "15L can",
        stockQuantity: 25,
        minimumOrder: 1,
        deliveryTime: "same-day",
        imageUrl: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod4",
        supplierId: "supplier2",
        name: "Fresh Onions",
        description: "Premium quality onions from Punjab",
        category: "vegetables",
        price: "900.00",
        unit: "50kg bag",
        stockQuantity: 100,
        minimumOrder: 1,
        deliveryTime: "same-day",
        imageUrl: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod5",
        supplierId: "supplier2",
        name: "Fresh Potatoes",
        description: "Grade A potatoes, perfect for street food",
        category: "vegetables",
        price: "1200.00",
        unit: "50kg bag",
        stockQuantity: 80,
        minimumOrder: 1,
        deliveryTime: "same-day",
        imageUrl: null,
        isActive: true,
        createdAt: new Date(),
      },
    ];

    products.forEach(product => this.products.set(product.id, product));

    // Sample orders
    const orders: Order[] = [
      {
        id: "order1",
        vendorId: "vendor1",
        supplierId: "supplier1",
        items: [
          { productId: "prod2", quantity: 1, price: "1250.00" },
          { productId: "prod3", quantity: 1, price: "1800.00" }
        ],
        totalAmount: "3050.00",
        status: "pending",
        deliveryAddress: "Shop 12, Block A, Connaught Place, New Delhi - 110001",
        orderDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        actualDelivery: null,
        notes: null,
      },
      {
        id: "order2",
        vendorId: "vendor1",
        supplierId: "supplier2",
        items: [
          { productId: "prod4", quantity: 2, price: "900.00" },
          { productId: "prod5", quantity: 1, price: "1200.00" }
        ],
        totalAmount: "2100.00",
        status: "delivered",
        deliveryAddress: "Shop 12, Block A, Connaught Place, New Delhi - 110001",
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        estimatedDelivery: null,
        actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        notes: null,
      },
    ];

    orders.forEach(order => this.orders.set(order.id, order));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      businessName: insertUser.businessName ?? null,
      businessAddress: insertUser.businessAddress ?? null,
      businessDescription: insertUser.businessDescription ?? null,
      deliveryRadius: insertUser.deliveryRadius ?? null,
      isVerified: insertUser.isVerified ?? false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Product operations
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(filters?: {
    category?: string;
    location?: string;
    supplierId?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);
    
    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters?.supplierId) {
      products = products.filter(p => p.supplierId === filters.supplierId);
    }

    // For location filtering, we'd need to implement geo-distance calculations
    // For now, we'll return all products
    
    return products.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description ?? null,
      minimumOrder: insertProduct.minimumOrder ?? 1,
      imageUrl: insertProduct.imageUrl ?? null,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
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
      status: insertOrder.status ?? "pending",
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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        businessName: insertUser.businessName ?? null,
        businessAddress: insertUser.businessAddress ?? null,
        businessDescription: insertUser.businessDescription ?? null,
        deliveryRadius: insertUser.deliveryRadius ?? null,
        isVerified: insertUser.isVerified ?? false,
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Product operations
  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProducts(filters?: {
    category?: string;
    location?: string;
    supplierId?: string;
  }): Promise<Product[]> {
    let conditions = [eq(products.isActive, true)];

    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }

    if (filters?.supplierId) {
      conditions.push(eq(products.supplierId, filters.supplierId));
    }

    const whereClause = and(...conditions);
    const results = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt));
    
    return results;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        ...insertProduct,
        description: insertProduct.description ?? null,
        minimumOrder: insertProduct.minimumOrder ?? 1,
        imageUrl: insertProduct.imageUrl ?? null,
        isActive: insertProduct.isActive ?? true,
      })
      .returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order operations
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrders(filters?: {
    vendorId?: string;
    supplierId?: string;
    status?: string;
  }): Promise<Order[]> {
    let conditions = [];

    if (filters?.vendorId) {
      conditions.push(eq(orders.vendorId, filters.vendorId));
    }

    if (filters?.supplierId) {
      conditions.push(eq(orders.supplierId, filters.supplierId));
    }

    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const results = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.orderDate));

    return results;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({
        ...insertOrder,
        status: insertOrder.status ?? "pending",
        estimatedDelivery: insertOrder.estimatedDelivery ?? null,
        actualDelivery: insertOrder.actualDelivery ?? null,
        notes: insertOrder.notes ?? null,
      })
      .returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  // Review operations
  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async getReviews(filters?: {
    supplierId?: string;
    vendorId?: string;
  }): Promise<Review[]> {
    let conditions = [];

    if (filters?.supplierId) {
      conditions.push(eq(reviews.supplierId, filters.supplierId));
    }

    if (filters?.vendorId) {
      conditions.push(eq(reviews.vendorId, filters.vendorId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const results = await db
      .select()
      .from(reviews)
      .where(whereClause)
      .orderBy(desc(reviews.createdAt));

    return results;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values({
        ...insertReview,
        comment: insertReview.comment ?? null,
      })
      .returning();
    return review;
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set(updates)
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
