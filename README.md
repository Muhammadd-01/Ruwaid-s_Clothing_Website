# Ruwaid's Clothing - E-Commerce Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce web application for a multi-brand online clothing store.

![Ruwaid's Clothing](https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800)

## 🌟 Features

### Customer Features
- **Browse Products** - Filter by brand, category, price, and search
- **Product Details** - View images, sizes, colors, and add to cart
- **User Authentication** - Register, login, JWT-based auth
- **Shopping Cart** - Add, update, remove items with real-time sync
- **Checkout Flow** - Multi-step (Address → Delivery → Payment → Review)
- **Order Management** - View order history, track status, cancel orders
- **User Profile** - Update info, manage multiple addresses

### Admin Features
- **Dashboard** - Revenue, orders, users, low stock alerts
- **Product Management** - Full CRUD with images, variants
- **Brand & Category Management** - Organize catalog
- **Order Management** - Update status, view details
- **User Management** - View users, update roles, delete accounts
- **Role-Based Access** - Admin and Super Admin levels

### Admin Panel Access
The Admin Panel is built directly into the frontend application. To access it:
1. Login with an Admin or Super Admin account.
2. Click on your profile icon in the navbar.
3. Select "Admin Panel" from the dropdown menu, or navigate directly to `/admin`.

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** + **Vite** - UI framework & build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
Ruwaid's_Clothing_Website/
├── backend/
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── seed.js         # Database seeder
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── lib/           # Utilities
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ruwaid's_Clothing_Website
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create `.env` in the backend folder:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ruwaids_clothing
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   SUPER_ADMIN_EMAIL=superadmin@ruwaids.com
   SUPER_ADMIN_PASSWORD=SuperAdmin@123
   SUPER_ADMIN_NAME=Super Admin
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start Backend Server**
   ```bash
   npm run dev
   ```
   The server will start and automatically:
   - Connect to MongoDB
   - Create Super Admin account
   - Seed database with sample data

5. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start Frontend**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 🔐 Default Credentials

### Super Admin
- **Email:** superadmin@ruwaids.com
- **Password:** SuperAdmin@123

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Design System

### Colors
- **Gold:** #D4AF37 (Primary)
- **Dark:** #0A0A0A (Background)
- **Dark-100:** #1A1A1A (Cards)
- **Dark-300:** #3A3A3A (Borders)

### Typography
- **Display:** Playfair Display
- **Body:** Inter

## 🏷️ Featured Brands

- J.
- Bonanza
- Alkaram
- Khaadi
- Gul Ahmed
- Sana Safinaz

## ⚠️ Disclaimer

Ruwaid's Clothing is an independent multi-brand retailer. All brand names, logos, and trademarks displayed are the property of their respective owners. We are not affiliated with, endorsed by, or sponsored by any of the brands we carry.

## 📝 License

This project is for educational and portfolio purposes.

---

Built with ❤️ for premium Pakistani fashion
