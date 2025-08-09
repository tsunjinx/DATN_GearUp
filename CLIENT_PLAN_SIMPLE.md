# DATN_GearUp — Professional Client-Side Plan (Admin Design Alignment)

Goal: Build a professional client-side application that **fully matches the admin/staff design system**. The customer experience should feel like a natural extension of the admin interface, maintaining the same sophisticated look, interaction patterns, and component behavior while being optimized for e-commerce.

## Design Philosophy: Professional Admin Experience for Customers

**Core Principle**: The customer-facing application should feel as polished and professional as the admin interface, using the exact same design tokens, components, and interaction patterns. This creates a cohesive brand experience and reduces development/maintenance overhead.

**Visual Identity**: 
- **Same Inter font** and typography scale as admin
- **Identical color palette** (primary green #22c55e, neutrals, semantics) 
- **Matching micro-interactions** and animations
- **Consistent component behavior** (buttons, cards, forms)
- **Professional layout patterns** adapted for commerce

## 1) Design System Alignment (Day 1)

### Core Infrastructure
- ✅ **Design tokens already established** in `src/styles/tokens.css` 
- ✅ **Shared UI components exist**: Button, Card, Table, Badge, FormControl
- ✅ **AdminLayout provides the blueprint** for professional layouts
- **Action Required**: Extend existing components for commerce use cases

### Customer Layout Architecture
**Replace current basic CustomerLayout with professional admin-inspired design:**

```vue
<!-- NEW: Professional customer header matching admin sophistication -->
<header class="customer-header">
  <!-- Left: Logo + Primary Navigation (horizontal admin-style nav) -->
  <div class="header-left">
    <GearUpLogo class="brand-logo" />
    <nav class="primary-nav">
      <router-link class="nav-item">Cửa hàng</router-link>
      <router-link class="nav-item">Thương hiệu</router-link>
      <router-link class="nav-item">Khuyến mãi</router-link>
    </nav>
  </div>
  
  <!-- Center: Professional search bar (admin-style input) -->
  <div class="header-center">
    <SearchBar class="professional-search" />
  </div>
  
  <!-- Right: Account actions (admin-style buttons and notifications) -->
  <div class="header-right">
    <WishlistButton />
    <CartButton /> 
    <AccountDropdown /> <!-- Admin-style dropdown -->
  </div>
</header>
```

### Professional Commerce Components
**Extend admin UI components for commerce:**
- **ProductCard**: Use admin Card component + commerce-specific slots
- **CategoryFilter**: Admin-style sidebar filtering (like sidebar nav)
- **PriceDisplay**: Consistent with admin badge styling
- **Breadcrumbs**: Match admin breadcrumb component exactly
- **Pagination**: Use admin table pagination patterns

## 2) Customer Experience Architecture (Days 2-3)

### Professional Customer Layout Structure
```
src/customer/
├── layouts/
│   ├── CustomerLayout.vue     # Professional header + footer
│   ├── CheckoutLayout.vue     # Simplified for checkout flow
│   └── AccountLayout.vue      # Admin-style sidebar for account
├── components/
│   ├── commerce/
│   │   ├── ProductCard.vue    # Admin Card + commerce data
│   │   ├── CategoryNav.vue    # Admin sidebar nav pattern
│   │   ├── SearchBar.vue      # Admin form input styling
│   │   ├── CartDrawer.vue     # Admin modal/drawer patterns
│   │   └── WishlistButton.vue # Admin button + badge styling
│   └── shared/ -> symlink to src/components/ui/
```

### State Management (Admin Pattern)
```javascript
// Follow admin store patterns exactly
stores/
├── customer/
│   ├── customerAuthStore.js   # Match authStore.js patterns
│   ├── cartStore.js          # ✅ Already follows admin patterns 
│   ├── catalogStore.js       # Match productStore.js patterns
│   ├── wishlistStore.js      # ✅ Already exists
│   └── checkoutStore.js      # Match orderStore.js patterns
```

## 3) Admin-Quality Customer Pages (Days 4-10)

### Professional Page Layouts
**Each page should feel like an admin screen:**

#### Home Page (Dashboard-inspired)
```vue
<template>
  <CustomerLayout>
    <!-- Admin-style page header -->
    <PageHeader title="Chào mừng đến GearUp" icon="🏠" />
    
    <!-- Admin card grid layout -->
    <div class="dashboard-grid">
      <Card class="hero-section">
        <PromoBanner />
      </Card>
      
      <Card class="featured-products">
        <CardHeader>Sản phẩm nổi bật</CardHeader>
        <ProductGrid :limit="8" />
      </Card>
      
      <Card class="categories">
        <CardHeader>Danh mục</CardHeader>
        <CategoryGrid />
      </Card>
    </div>
  </CustomerLayout>
</template>
```

#### Product Catalog (Table/Grid View)
```vue
<template>
  <CustomerLayout>
    <div class="catalog-container">
      <!-- Admin-style sidebar filtering -->
      <aside class="filter-sidebar">
        <Card>
          <CardHeader>Bộ lọc</CardHeader>
          <FilterForm /> <!-- Admin form styling -->
        </Card>
      </aside>
      
      <!-- Admin-style main content area -->
      <main class="catalog-content">
        <div class="catalog-header">
          <PageHeader title="Danh mục sản phẩm" />
          <div class="view-controls">
            <Button variant="outline">Grid</Button>
            <Button variant="outline">List</Button>
          </div>
        </div>
        
        <ProductGrid class="products-grid" />
        <Pagination /> <!-- Admin pagination -->
      </main>
    </div>
  </CustomerLayout>
</template>
```

#### Product Details (Modal-inspired)
```vue
<template>
  <CustomerLayout>
    <Card class="product-details-card">
      <div class="product-layout">
        <div class="product-gallery">
          <ImageGallery /> <!-- Admin modal patterns -->
        </div>
        <div class="product-info">
          <ProductHeader />
          <ProductOptions /> <!-- Admin form controls -->
          <ProductActions /> <!-- Admin buttons -->
        </div>
      </div>
    </Card>
  </CustomerLayout>
</template>
```

#### Account Area (Admin Sidebar Layout)
```vue
<template>
  <AccountLayout>
    <!-- Exact copy of admin sidebar navigation pattern -->
    <aside class="account-sidebar">
      <nav class="account-nav">
        <router-link class="nav-link">Thông tin cá nhân</router-link>
        <router-link class="nav-link">Đơn hàng</router-link>
        <router-link class="nav-link">Địa chỉ</router-link>
        <router-link class="nav-link">Yêu thích</router-link>
      </nav>
    </aside>
    
    <main class="account-content">
      <router-view /> <!-- Admin content area -->
    </main>
  </AccountLayout>
</template>
```

### Professional Component Standards
**Every customer component must:**
1. **Use admin design tokens** (`var(--primary-500)`, `var(--spacing-md)`, etc.)
2. **Follow admin interaction patterns** (hover states, focus rings, loading states)
3. **Match admin responsive behavior** (same breakpoints, same mobile patterns)
4. **Use admin typography scale** (same font sizes, weights, line heights)
5. **Implement admin accessibility** (same ARIA patterns, keyboard navigation)

## 4) Advanced Customer Features (Days 11-15)

### Professional Cart & Checkout
```vue
<!-- Cart Drawer (Admin modal pattern) -->
<teleport to="body">
  <div class="modal-overlay" v-if="cartOpen">
    <div class="cart-drawer modal-content">
      <ModalHeader title="Giỏ hàng" @close="closeCart" />
      <div class="cart-items">
        <CartItem v-for="item in items" /> <!-- Admin table row styling -->
      </div>
      <ModalFooter>
        <Button variant="outline" @click="closeCart">Tiếp tục mua</Button>
        <Button variant="primary" @click="goCheckout">Thanh toán</Button>
      </ModalFooter>
    </div>
  </div>
</teleport>
```

### Professional Search & Filtering
- **Search autocomplete**: Admin dropdown styling
- **Filter panels**: Admin sidebar navigation patterns  
- **Sort controls**: Admin table header styling
- **Result states**: Admin empty/loading/error states

### Professional Account Management
- **Order history**: Admin table component
- **Address book**: Admin form + card layouts
- **Profile editing**: Admin form patterns
- **Wishlist**: Admin table/grid toggle

## 5) Quality Assurance (Days 16-18)

### Admin-Quality Standards
- ✅ **Visual consistency**: Every pixel matches admin aesthetic
- ✅ **Interaction consistency**: All hover/focus/active states identical
- ✅ **Performance**: Lighthouse > 90 (admin-level optimization)
- ✅ **Accessibility**: WCAG AA compliance (admin-level)
- ✅ **Responsiveness**: Perfect mobile experience (admin-level)

### Testing Checklist
- [ ] **Component parity**: Customer components behave identically to admin
- [ ] **Token usage**: No hardcoded colors/spacing (all tokens)
- [ ] **Mobile excellence**: Touch-friendly, performant mobile UX
- [ ] **Cross-browser**: Consistent across all browsers
- [ ] **Performance**: Fast loading, smooth interactions

## Design Language Preservation (Non-Negotiable)

### Visual Consistency
- **Colors**: Exact same palette as admin (`--primary-500`, etc.)
- **Typography**: Inter font, identical scale and weights
- **Spacing**: Same `--spacing-*` token usage throughout
- **Border radius**: Same `--radius-*` values
- **Shadows**: Same `--shadow-*` depth and usage

### Interaction Consistency  
- **Button behaviors**: Identical hover/focus/loading states
- **Form controls**: Same styling and validation patterns
- **Modal/drawer**: Exact same animation and layout patterns
- **Navigation**: Same active states and transition timing
- **Loading states**: Identical spinners and skeleton patterns

### Component Reuse Strategy
- **100% shared**: Button, Card, Badge, FormControl, Table
- **Extended**: Admin components + commerce-specific slots/props
- **Commerce-specific**: Only where absolutely necessary (ProductCard, CartItem)
- **Layout adaptation**: Admin patterns adapted for horizontal commerce layouts

## Professional Tooling Stack

### Required Dependencies
- ✅ **@vueuse/head** (already implemented)
- ✅ **vitest + @vue/test-utils** (testing infrastructure)
- **@vueuse/core** (admin-level composables)
- **vee-validate** (professional form validation)

### Optional Enhancements
- **TypeScript migration** (admin-level type safety)
- **Cypress E2E** (admin-level integration testing)
- **Storybook** (component documentation like admin)

### No Additional CSS Frameworks
- **Maintain current approach**: Scoped CSS + design tokens
- **No Tailwind**: Keep professional admin aesthetic intact
- **No utility libraries**: Preserve component-based architecture

## Implementation Roadmap (18-Day Sprint)

### Phase 1: Foundation (Days 1-3)
- [x] **Design tokens established** (`src/styles/tokens.css`)
- [x] **Shared UI components built** (Button, Card, Table, Badge, FormControl)
- [x] **AdminLayout provides professional blueprint**
- [ ] **Extend CustomerLayout** with admin-level sophistication
- [ ] **Create commerce component extensions** (ProductCard, CartDrawer, etc.)
- [ ] **Implement professional customer header** (admin-style navigation)

### Phase 2: Admin System Completion (Days 4-8)
- [ ] **Products Management**: Professional search/filter, image gallery, bulk operations
- [ ] **Orders Management**: Timeline view, bulk status updates, printable invoices  
- [ ] **Inventory Management**: Low-stock alerts, adjustment tracking, supplier integration
- [ ] **Analytics Dashboard**: Sales insights, inventory turnover, CSV exports
- [ ] **Notification System**: Real-time polling, persistent unread states

### Phase 3: Professional Customer Experience (Days 9-15)
- [ ] **Home Page**: Dashboard-inspired layout with admin card patterns
- [ ] **Product Catalog**: Admin-style filtering sidebar + grid/list views
- [ ] **Product Details**: Modal-inspired layout with admin form controls
- [ ] **Professional Cart**: Admin modal patterns with sophisticated interactions
- [ ] **Checkout Flow**: Multi-step admin-style wizard with validation
- [ ] **Account Dashboard**: Exact replica of admin sidebar navigation
- [ ] **Order History**: Admin table component with filtering/sorting
- [ ] **Wishlist Management**: Admin-style data table with actions

### Phase 4: Advanced Features (Days 16-17)
- [ ] **Advanced Search**: Admin-style autocomplete with filters
- [ ] **Product Comparison**: Admin-style data tables
- [ ] **Review System**: Admin form patterns + rating displays
- [ ] **Address Management**: Admin CRUD patterns
- [ ] **Professional Authentication**: Admin-level security UX

### Phase 5: Quality Assurance (Day 18)
- [ ] **Visual consistency audit**: Every component matches admin aesthetic
- [ ] **Performance optimization**: Lighthouse > 90 scores
- [ ] **Accessibility compliance**: WCAG AA standards
- [ ] **Cross-browser testing**: Consistent experience everywhere
- [ ] **Mobile excellence**: Touch-optimized interactions

## Success Criteria (Professional Standards)

### Visual Excellence
- ✅ **Pixel-perfect consistency**: Customer components indistinguishable from admin quality
- ✅ **Professional interactions**: All hover/focus/loading states match admin exactly
- ✅ **Typography perfection**: Inter font usage identical to admin
- ✅ **Color consistency**: Design tokens used 100% throughout

### Technical Excellence  
- ✅ **Component reuse**: 90%+ shared components between admin/customer
- ✅ **Performance**: Sub-3s load times, 60fps interactions
- ✅ **Accessibility**: Full keyboard navigation, screen reader support
- ✅ **Mobile-first**: Perfect responsive behavior on all devices

### Business Excellence
- ✅ **Complete e-commerce flow**: Browse → Add to Cart → Checkout → Order
- ✅ **Professional account management**: Full customer dashboard
- ✅ **Advanced product discovery**: Search, filters, categories, recommendations
- ✅ **Admin-level reliability**: Error handling, loading states, edge cases

### Development Excellence
- ✅ **Maintainable architecture**: Clear patterns, consistent conventions
- ✅ **Test coverage**: Unit + integration + E2E testing
- ✅ **Documentation**: Component stories, API docs, setup guides
- ✅ **CI/CD pipeline**: Automated testing, linting, building, deployment

## Final Deliverable

**A professional e-commerce application that customers will perceive as being built by the same team that built the admin interface** - cohesive, sophisticated, and trustworthy. The customer experience should feel like "the public version of the professional admin system" rather than a separate, less-polished application.

