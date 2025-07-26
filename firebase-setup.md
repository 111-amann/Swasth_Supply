# Firebase Setup for Swasth Supply

## Environment Variables Setup

Your Firebase configuration is automatically loaded from Replit Secrets. The following environment variables are configured:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=swasth-supply.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=swasth-supply
VITE_FIREBASE_STORAGE_BUCKET=swasth-supply.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## Features Available

### 1. Authentication
- User registration and login with email/password
- Role-based authentication (Vendor/Supplier)
- Persistent login sessions
- Firebase Auth integration

### 2. Database (Firestore)
- Real-time product data synchronization
- User profiles and business information
- Order management and tracking
- Review and rating system

### 3. File Storage
- Product image uploads to Firebase Storage
- Automatic image optimization and CDN delivery
- Secure file access with Firebase Security Rules

## How to Use

### For New Users
1. Click "Sign Up" on the homepage
2. Choose your role (Vendor or Supplier)
3. Complete your profile information
4. Start using the marketplace features

### For Suppliers
1. Access the Supplier Dashboard
2. Add products to your inventory
3. Upload product images (automatically saved to Firebase)
4. Manage orders from vendors
5. Track business analytics

### For Vendors
1. Browse suppliers in your area
2. Search products by category
3. Place orders with suppliers
4. Track order status and delivery

## Firebase Project Structure

```
swasth-supply (Firebase Project)
├── Authentication
│   ├── Users (email/password)
│   └── Custom Claims (roles)
├── Firestore Database
│   ├── users (user profiles)
│   ├── products (product catalog)
│   ├── orders (order management)
│   └── reviews (ratings & feedback)
└── Storage
    ├── products/ (product images)
    └── profiles/ (user avatars)
```

## Security

- All Firebase operations use proper authentication
- Firestore Security Rules protect user data
- Images are stored securely in Firebase Storage
- API keys are environment variables (never in code)

## Deployment

The application is ready for deployment with:
- Production Firebase configuration
- Optimized build process  
- CDN-ready static assets
- Environment-based configuration

Your marketplace is fully functional with Firebase backend!