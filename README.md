# EasyParts - Automotive Spare Parts Marketplace

A comprehensive full-stack marketplace platform for buying and selling automotive spare parts.

## 🚀 Project Overview

**EasyParts** is a complete marketplace where:
- Individual users can sell used parts
- Auto shops can sell new and used parts
- Buyers can search, compare, and purchase parts
- Administrators manage the platform

## 👥 User Types

1. **Guest** - Browse only
2. **Buyer** - Search, purchase, leave reviews
3. **Individual Seller** - Sell used parts
4. **Shop Account** - Professional seller account
5. **Admin** - Complete platform management

## 🛠 Tech Stack

### Frontend
- React 18+
- Next.js 14+
- Tailwind CSS
- Redux Toolkit
- Socket.io (Real-time messaging)

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe Payment Integration

## 📁 Project Structure

```
easyparts/
├── backend/           # Express.js API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, validation
│   └── server.js     # Entry point
├── frontend/         # React/Next.js app
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── public/
└── docs/            # Documentation
```

## ⚙️ Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your config
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📋 Features

- ✅ User Authentication (Email, Google, Apple)
- ✅ Advanced Search & Filtering
- ✅ Real-time Messaging
- ✅ Order Management
- ✅ Review System
- ✅ Admin Dashboard
- ✅ Payment Integration
- ✅ Mobile Responsive

## 📚 API Documentation

See `/docs` for detailed API documentation

## 📝 License

MIT
