# DATN_GearUp — Client-Side Development Plan (Corrected)

**Project**: Shoe store management system with admin dashboard + customer e-commerce site  
**Tech Stack**: Vue 3 + Composition API + Pinia + Vite + Scoped CSS  
**Current Status**: Admin partially built, customer basic structure exists

## ✅ What's Already Working Well

### Admin System Foundation
- ✅ **Professional AdminLayout**: Sophisticated sidebar, notifications, responsive design
- ✅ **Design System**: Design tokens (`src/styles/tokens.css`), shared UI components
- ✅ **Routing**: Protected admin routes, customer routes structured
- ✅ **Authentication**: Auth guards, session management
- ✅ **Store Architecture**: Pinia stores for auth, products, orders, cart, wishlist

### Customer System Foundation  
- ✅ **Basic CustomerLayout**: Header with search, cart, wishlist
- ✅ **Key Pages**: Home, Catalog, Cart, Checkout, Account, Wishlist
- ✅ **Shopping Features**: Add to cart, wishlist, search with debounce
- ✅ **UI Components**: Reusing admin components (Card, Button, FormControl)

### Code Quality
- ✅ **Vue 3 Best Practices**: `<script setup>`, proper composables
- ✅ **Performance**: Lazy loading, debounced search, pagination
- ✅ **Accessibility**: Proper ARIA labels, semantic HTML

## 🎯 Priority 1: Complete Admin System (Days 1-10)

### Admin Pages Need Implementation:
1. **Dashboard.vue** - Analytics, charts, key metrics
2. **Products.vue** - CRUD, search, filtering, image upload
3. **Orders.vue** - Order management, status updates, printing
4. **Customers.vue** - Customer profiles, purchase history
5. **Employees.vue** - Staff management, roles
6. **Inventory.vue** - Stock tracking, alerts
7. **Analytics.vue** - Advanced reporting
8. **Discounts.vue + Coupons.vue** - Promotion management

### Implementation Approach:
```vue
<!-- Example: Complete Products.vue -->
<template>
  <!-- Reuse admin layout patterns -->
  <div class="page-header">
    <h1>👟 Quản lý Sản phẩm</h1>
    <Button @click="showAddModal = true">Thêm sản phẩm</Button>
  </div>
  
  <!-- Admin-style toolbar -->
  <Card class="toolbar">
    <FormControl placeholder="Tìm sản phẩm..." v-model="searchQuery" />
    <select v-model="filterBrand" class="filter-select">
      <option value="">Tất cả thương hiệu</option>
      <option value="nike">Nike</option>
      <option value="adidas">Adidas</option>
    </select>
  </Card>
  
  <!-- Admin-style data table -->
  <Table :headers="tableHeaders" :items="filteredProducts">
    <template #actions="{ item }">
      <Button size="sm" @click="editProduct(item)">Sửa</Button>
      <Button size="sm" variant="danger" @click="deleteProduct(item)">Xóa</Button>
    </template>
  </Table>
</template>
```

## 🎯 Priority 2: Polish Customer Experience (Days 11-15)

### Current Customer Issues to Fix:
1. **API Integration**: Connect to actual backend endpoints
2. **Product Details**: Rich product pages with variants, reviews
3. **Checkout Flow**: Multi-step checkout with validation
4. **Account Management**: Order history, profile editing
5. **Search Enhancement**: Better filtering, sorting, autocomplete

### Customer Enhancement Strategy:
```vue
<!-- Enhanced product details page -->
<template>
  <CustomerLayout>
    <!-- Reuse admin Card component -->
    <Card class="product-detail">
      <div class="product-grid">
        <ImageGallery :images="product.images" />
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <div class="price">{{ formatCurrency(product.price) }}</div>
          
          <!-- Size/color selection -->
          <div class="variants">
            <div v-for="size in product.sizes" :key="size" 
                 :class="['size-option', { selected: selectedSize === size }]"
                 @click="selectedSize = size">
              {{ size }}
            </div>
          </div>
          
          <!-- Reuse admin Button component -->
          <div class="actions">
            <Button @click="addToCart" :loading="adding">
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline" @click="addToWishlist">
              ❤️ Yêu thích
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </CustomerLayout>
</template>
```

## 🎯 Priority 3: Backend Integration (Days 16-18)

### API Services to Complete:
```javascript
// src/services/productService.js - Already structured, needs implementation
export const productService = {
  async getProducts(params = {}) {
    // Replace mock with real API call
    const response = await api.get('/api/products', { params })
    return response.data
  },
  
  async getProductById(id) {
    const response = await api.get(`/api/products/${id}`)
    return response.data
  },
  
  // Admin-specific methods
  async createProduct(productData) {
    const response = await api.post('/api/admin/products', productData)
    return response.data
  }
}
```

## 🛠️ Technical Implementation Plan

### Days 1-3: Admin Dashboard & Products
- Complete `Dashboard.vue` with real metrics
- Finish `Products.vue` CRUD operations
- Connect to product API endpoints

### Days 4-6: Admin Orders & Customers  
- Build comprehensive order management
- Customer profile pages with purchase history
- Order status tracking and updates

### Days 7-9: Admin Inventory & Analytics
- Stock management with alerts
- Advanced reporting and analytics
- Data export functionality

### Days 10: Admin Polish
- Employee management
- Discount/coupon system
- Final admin UI polish

### Days 11-13: Customer Enhancement
- Rich product detail pages
- Enhanced search and filtering
- Better shopping cart experience

### Days 14-15: Customer Checkout & Account
- Multi-step checkout process
- Account management dashboard
- Order history and tracking

### Days 16-18: Integration & Testing
- Backend API integration
- Error handling and loading states
- Performance optimization and testing

## 📋 Success Criteria

### Admin System
- ✅ Complete CRUD for all entities (products, orders, customers, employees)
- ✅ Professional data tables with sorting/filtering
- ✅ Real-time dashboard with metrics
- ✅ Proper error handling and loading states

### Customer System  
- ✅ Complete e-commerce flow (browse → cart → checkout → order)
- ✅ Product search and filtering
- ✅ Account management and order history
- ✅ Mobile-responsive design

### Code Quality
- ✅ Consistent use of design tokens and shared components
- ✅ Proper TypeScript types and validation
- ✅ Performance optimization (lazy loading, debouncing)
- ✅ No console errors, proper error boundaries

## 🚀 Final Deliverable

A complete shoe store management system with:
- **Professional admin dashboard** for staff to manage products, orders, customers
- **Customer e-commerce site** for shopping experience  
- **Shared design system** ensuring consistency
- **Production-ready code** following Vue 3 best practices

The system will demonstrate modern frontend development with Vue 3, proper state management with Pinia, and maintainable component architecture.
