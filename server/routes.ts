import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import express from "express";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if not exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
  }

  // Serve uploaded files statically
  app.use("/uploads", express.static("uploads"));

  // Multer config
  const uploadStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
      const uniqueSuffix = randomUUID() + path.extname(file.originalname);
      cb(null, uniqueSuffix);
    },
  });

  const upload = multer({
    storage: uploadStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const isValid =
        allowedTypes.test(file.mimetype) &&
        allowedTypes.test(path.extname(file.originalname).toLowerCase());
      isValid
        ? cb(null, true)
        : cb(new Error("Only PNG, JPG, JPEG, GIF and WebP files are allowed"));
    },
  });

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Upload route
  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  });

  // ==================== USER ROUTES ====================
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      user
        ? res.json(user)
        : res.status(404).json({ message: "User not found" });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/firebase/:firebaseUid", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.params.firebaseUid);
      user
        ? res.json(user)
        : res.status(404).json({ message: "User not found" });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // ==================== PRODUCT ROUTES ====================
  app.get("/api/products", async (req, res) => {
    try {
      const { category, location, supplierId } = req.query;
      const products = await storage.getProducts({
        category: category as string,
        location: location as string,
        supplierId: supplierId as string,
      });
      res.json(products);
    } catch {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    const { supplierId, name, category, price, unit, stockQuantity, deliveryTime } = req.body;
    if (!supplierId || !name || !category || !price || !unit || !stockQuantity || !deliveryTime) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["supplierId", "name", "category", "price", "unit", "stockQuantity", "deliveryTime"],
      });
    }

    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      product
        ? res.json(product)
        : res.status(404).json({ message: "Product not found" });
    } catch {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      product
        ? res.json(product)
        : res.status(404).json({ message: "Product not found" });
    } catch {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ==================== ORDER ROUTES ====================
  app.get("/api/orders", async (req, res) => {
    try {
      const { vendorId, supplierId, status } = req.query;
      const orders = await storage.getOrders({
        vendorId: vendorId as string,
        supplierId: supplierId as string,
        status: status as string,
      });
      res.json(orders);
    } catch {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      order
        ? res.json(order)
        : res.status(404).json({ message: "Order not found" });
    } catch {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // ==================== REVIEW ROUTES ====================
  app.get("/api/reviews", async (req, res) => {
    try {
      const { supplierId, vendorId } = req.query;
      const reviews = await storage.getReviews({
        supplierId: supplierId as string,
        vendorId: vendorId as string,
      });
      res.json(reviews);
    } catch {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const review = await storage.createReview(req.body);
      res.status(201).json(review);
    } catch {
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // ================= SUPPORT MESSAGES =================
  app.get("/api/support-messages", async (req, res) => {
    try {
      const { status } = req.query;
      const messages = await storage.getSupportMessages({
        status: status as string,
      });
      res.json(messages);
    } catch {
      res.status(500).json({ message: "Failed to fetch support messages" });
    }
  });

  app.post("/api/support-messages", async (req, res) => {
    const { name, phone, message, source, status } = req.body;

    if (!name || !phone || !message || !source) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["name", "phone", "message", "source"],
      });
    }

    try {
      const supportMessage = await storage.createSupportMessage({
        name,
        phone,
        message,
        source,
        status: status || "open",
      });
      res.status(201).json(supportMessage);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create support message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.put("/api/support-messages/:id", async (req, res) => {
    try {
      const message = await storage.updateSupportMessage(req.params.id, req.body);
      message
        ? res.json(message)
        : res.status(404).json({ message: "Support message not found" });
    } catch {
      res.status(500).json({ message: "Failed to update support message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
