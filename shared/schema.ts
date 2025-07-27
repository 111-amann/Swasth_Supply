import { z } from "zod";

// Firebase-based TypeScript interfaces for StreetSupply B2B Marketplace

// USER INTERFACE
export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'vendor' | 'supplier';
  location: string;
  businessName?: string;
  businessAddress?: string;
  businessDescription?: string;
  deliveryRadius?: number; // for suppliers, in km
  isVerified: boolean;
  createdAt: Date;
}

// PRODUCT INTERFACE
export interface Product {
  id: string;
  supplierId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string; // kg, liter, piece, pack
  stockQuantity: number;
  minimumOrder?: number;
  deliveryTime: string;
  imageUrl?: string;
  supplierName?: string;
  supplierLocation?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ORDER INTERFACE
export interface Order {
  id: string;
  vendorId: string;
  supplierId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string; // Customer notes
  supplierNotes?: string; // Supplier notes/updates
  vendorName?: string;
  supplierName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ORDER ITEM INTERFACE
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  unit: string;
}

// REVIEW INTERFACE
export interface Review {
  id: string;
  orderId: string;
  vendorId: string;
  supplierId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// SUPPORT MESSAGES TABLE ← Added from comp1
export const supportMessages = pgTable("support_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  source: text("source").notNull(), // 'support_page', 'chat_support', etc
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

// SCHEMAS
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).omit({
  id: true,
  createdAt: true,
});

// TYPES
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;
