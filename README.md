# 🚀 DATN_GearUp - Admin Dashboard

A modern, responsive admin dashboard for GearUp shoe store management system built with Vue 3 and Vite.

## ✨ Features

### � Authentication System
- Secure login/logout functionality
- Session management with localStorage
- Route protection with authentication guards

### 📊 Dashboard & Analytics
- Real-time statistics overview
- Revenue charts and analytics
- Top-selling products tracking
- Recent orders monitoring

### 🛍️ Product Management
- Complete CRUD operations for products
- Product categorization and filtering
- Inventory tracking
- Image management

### 👥 Customer Management
- Customer profiles and data
- Purchase history tracking
- Customer analytics

### 👨‍💼 Employee Management
- Staff management system
- Role-based access control
- Employee performance tracking

### 🧾 Order Management
- Order processing workflow
- Order status tracking
- Invoice generation

### 🏷️ Promotions & Discounts
- Discount campaigns management
- Coupon system
- Promotional tools

## 🛠️ Tech Stack

- **Frontend Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Routing:** Vue Router 4
- **State Management:** Pinia
- **Styling:** CSS3 with Scoped Components
- **Icons:** Unicode Emojis
- **Authentication:** Custom JWT-like system

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/tsunjinx/DATN_GearUp.git
cd DATN_GearUp
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials
- **Username:** `admin`
- **Password:** `admin`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # UI-specific components
├── composables/        # Vue composition functions
├── layouts/            # Layout components
├── router/             # Vue Router configuration
├── services/           # API services
├── stores/             # Pinia stores
├── views/              # Page components
├── assets/             # Static assets
└── utils/              # Utility functions
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:check      # Check linting without fixing
npm run format          # Format code with Prettier
npm run format:check    # Check formatting
npm run type-check      # Run TypeScript type checking
```

## 🌟 Key Features Details

### Authentication Flow
- Login page with form validation
- Automatic redirection based on authentication status
- Session persistence with localStorage
- Protected routes requiring authentication

### Dashboard Overview
- Statistics cards showing key metrics
- Monthly revenue chart with interactive bars
- Top-selling products list with rankings
- Recent orders table with status indicators

### Admin Layout
- Responsive sidebar navigation
- Professional header with user info
- Consistent styling across all pages
- Mobile-friendly design

## 🎨 Design System

- **Primary Colors:** Blue gradient (#667eea to #764ba2)
- **Typography:** Segoe UI font family
- **Components:** Modern card-based layout
- **Responsive:** Mobile-first approach
- **Icons:** Unicode emojis for simplicity

## 🔒 Security Features

- Route-level authentication guards
- Protected admin routes
- Guest-only routes (login page)
- Session validation
- Automatic logout functionality

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

## 🛣️ Roadmap

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export functionality
- [ ] Advanced search and filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes as part of a graduation thesis (DATN).

## 👨‍💻 Author

**tsunjinx**
- GitHub: [@tsunjinx](https://github.com/tsunjinx)
- Email: hoangnongls154@gmail.com

---

⭐ If you find this project helpful, please give it a star!
