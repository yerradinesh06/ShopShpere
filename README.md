# 🛒 ShopSphere - Modern MERN Stack E-Commerce Web Application

ShopSphere is a premium, feature-rich e-commerce application built on the **MERN (MongoDB, Express.js, React, Node.js)** stack. It offers a fully functional storefront with advanced product discovery, dynamic shopping cart & checkout flows, order tracking, and a powerful Admin Dashboard with built-in analytics.

Additionally, ShopSphere features an automatic **File-based Local DB Fallback** system. If MongoDB connection is unavailable, it gracefully falls back to a custom JSON-based storage layer to ensure uninterrupted development.

---

## ✨ Features

### 🛍️ Storefront & User Experience
- **Interactive Product Catalog**: Search, category filters, price range sliders, sorting, and availability status.
- **Product Details & Reviews**: Deep product description, image display, and user-submitted rating & reviews.
- **Persistent Cart System**: Seamless cart item additions, quantity management, and subtotal calculation stored locally.
- **Dynamic Theme Mode**: Seamless toggle between stunning Dark Mode and Clean Light Mode.
- **User Profile**: Custom dashboard showing personal details and a list of all historical orders.

### 💳 Checkout & Order Lifecycle
- **Multistep Checkout**: Shipping address details, order breakdown, and mock payment options.
- **Real-Time Order Tracking**: Visual progress bars tracking order lifecycle stages: `Processing` ➔ `Shipped` ➔ `Delivered`.
- **Payment Method Integration**: Placeholder configurations for payment gateways.

### 📊 Admin Panel & Management Dashboard
- **Interactive Sales Charts**: Visual indicators tracking total revenue, total sales, user registrations, and order counts.
- **Comprehensive CRUD Operations**: Create, update, view, and delete products directly from the admin interface.
- **Order Management**: Fulfill, update status, and manage user orders globally.
- **User Directory**: View list of registered customers.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React (v19), Vite, React Router DOM, Vanilla CSS, Lucide React (Icons) |
| **Backend** | Node.js, Express.js, JWT Authentication, BcryptJS |
| **Database** | MongoDB / Mongoose *with* custom JSON-file adapter fallback (`data/db.json`) |
| **Tooling** | Concurrently, Nodemon, Oxlint |

---

## 📂 Project Architecture

```text
ShopSphere/
├── backend/                  # Express API Server
│   ├── data/                 # Database seeding scripts and JSON fallback database
│   └── src/
│       ├── config/           # Database & environmental configurations
│       ├── controllers/      # Route handler controllers
│       ├── middleware/       # JWT auth & route authorization middleware
│       ├── models/           # Mongoose schemas & Local File Database Adapter
│       ├── routes/           # Express API endpoints
│       └── server.js         # Backend server entry point
├── frontend/                 # React SPA (Vite)
│   ├── public/               # Static assets
│   └── src/
│       ├── assets/           # Media files & stylesheets
│       ├── components/       # Reusable UI components (Navbar, Footer, Admin, etc.)
│       ├── context/          # Context API providers (Auth, Cart, Theme)
│       ├── pages/            # View Pages (Home, Shop, AdminDashboard, etc.)
│       ├── App.jsx           # Main routing & app wrap
│       └── main.jsx          # React app mount
├── package.json              # Global build & concurrent runner scripts
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **NPM** (packaged with Node.js)
- **MongoDB** (Optional. If not installed/configured, the application will automatically fall back to local JSON database storage).

### 2. Installation
Clone the repository and install all dependencies in one command from the project root:
```bash
npm run install-all
```
*This installs dependencies for the root, frontend, and backend folders.*

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://localhost:27017/shopsphere # Optional fallback
```

### 4. Seeding the Database
To populate the database with sample products, users, and orders, run:
```bash
npm run seed
```

### 5. Running the Application
To launch both the backend server and the frontend client simultaneously in development mode, run:
```bash
npm run dev
```
- **Frontend** runs on: `http://localhost:5173`
- **Backend API** runs on: `http://localhost:5000`

---

## 🔐 Seeded Accounts for Testing

After seeding the database, you can log in using these pre-configured accounts:

### 👤 Customer Account
- **Email:** `john@gmail.com`
- **Password:** `password123`

### 🔑 Administrator Account
- **Email:** `admin@shopsphere.com`
- **Password:** `adminpassword123`