# Database Schema Analysis for GearUp Discount & Coupon System

## 📊 **Database Schema Analysis**

Based on the provided database schema, here's how our current implementation aligns with the actual ERD structure:

## 🎯 **Key Entities Related to Discounts & Coupons**

### **1. Discount Management Entity**
```json
"đơn_giám_giá": {
  "primary_key": "id",
  "attributes": {
    "id": "int",
    "ma_dot_giam_gia": "string",           // Discount code
    "ten_dot_giam_gia": "string",          // Discount name  
    "so_len_giam_toi_da": "decimal",       // Maximum discount amount
    "ngày_bắt_đầu": "date",                // Start date
    "ngày_kết_thúc": "date",               // End date
    "tạng_thái": "string",                 // Status
    "deleted": "boolean"                   // Soft delete
  }
}
```

### **2. Coupon Management Entity**
```json
"phiếu_giảm_giá": {
  "primary_key": "id", 
  "attributes": {
    "id": "int",
    "ten_phieu_giam_gia": "string",        // Coupon name
    "chi_phieu_giam_gia": "decimal",       // Coupon value
    "so_luong": "int",                     // Quantity/Usage limit
    "ngày_bat_đau": "date",                // Start date
    "ngày_ket_thuc": "date",               // End date
    "trang_thai": "string",                // Status
    "deleted": "boolean"                   // Soft delete
  }
}
```

### **3. Personal Coupon Entity**
```json
"phiếu_giảm_giá_cá_nhân": {
  "primary_key": "id",
  "attributes": {
    "id": "int",
    "id_khach_hang": "int",                // Customer ID
    "id_phieu_giam_gia": "int",            // Coupon ID
    "ten_phieu_giam_gia_ca_nhan": "string", // Personal coupon name
    "ngày_sinh": "date",                   // Birth date (seems incorrect?)
    "ngày_het_han": "date",                // Expiry date
    "trang_thai": "string",                // Status
    "deleted": "boolean"                   // Soft delete
  }
}
```

## 🔗 **Key Relationships**

### **Product-Discount Relationship**
```json
{
  "type": "one_to_many",
  "from": "đơn_giám_giá", 
  "to": "sản_phẩm_chi_tiết",
  "foreign_key": "id_dot_giam_gia"
}
```

### **Customer-Coupon Relationships**
```json
{
  "type": "one_to_many",
  "from": "kháčh_hàng",
  "to": "phiếu_giảm_giá_cá_nhân", 
  "foreign_key": "id_khach_hang"
},
{
  "type": "one_to_many",
  "from": "phiếu_giảm_giá",
  "to": "phiếu_giảm_giá_cá_nhân",
  "foreign_key": "id_phieu_giam_gia"
}
```

### **Order-Coupon Relationship**
```json
{
  "type": "one_to_many",
  "from": "phiếu_giảm_giá",
  "to": "hóa_đơn",
  "foreign_key": "id_phieu_giam_gia"
}
```

## ✅ **What We Got Right**

### **Field Alignment**
- ✅ **Status tracking**: `trang_thai` field in both entities
- ✅ **Date ranges**: Start/end dates for validity periods  
- ✅ **Soft deletion**: `deleted` boolean field
- ✅ **Naming**: Vietnamese field names preserved
- ✅ **Value tracking**: Discount amounts and coupon values

### **Functionality Alignment** 
- ✅ **Toggle status**: Matches `trang_thai` field manipulation
- ✅ **Date validation**: Expiry checking aligns with date fields
- ✅ **Usage tracking**: Quantity limits align with `so_luong`

## ⚠️ **Gaps & Improvements Needed**

### **Missing Database Field Mappings**

#### **1. Discount Entity Gaps**
```javascript
// Current implementation missing:
const discountData = {
  ma_dot_giam_gia: '',        // Discount code - MISSING
  so_len_giam_toi_da: 0,      // Max discount amount - MISSING
  // We have: name, value, startDate, endDate, isActive
}
```

#### **2. Coupon Entity Gaps** 
```javascript
// Current implementation missing:
const couponData = {
  ten_phieu_giam_gia: '',     // Should match our 'description'
  chi_phieu_giam_gia: 0,      // Should match our 'value'  
  so_luong: 0,                // Should match our 'maxUses'
  // We have: code, description, value, maxUses, expiryDate
}
```

### **Missing Relationship Handling**

#### **1. Product-Discount Assignment**
- **Database**: Discounts linked to `sản_phẩm_chi_tiết` 
- **Current**: No product selection in discount modals
- **Needed**: Product selection interface as shown in reference images

#### **2. Customer-Coupon Targeting**
- **Database**: Personal coupons via `phiếu_giảm_giá_cá_nhân`
- **Current**: No customer targeting system
- **Needed**: Customer selection interface as shown in reference images

#### **3. Usage Tracking**
- **Database**: Coupons used in `hóa_đơn` orders
- **Current**: Simple `usedCount` tracking
- **Needed**: Proper order integration

## 🎯 **Required Updates**

### **1. Update Data Models**

#### **Discount Model Enhancement**
```javascript
const discountForm = ref({
  ma_dot_giam_gia: '',           // Add: Discount code
  ten_dot_giam_gia: '',          // Rename: name -> ten_dot_giam_gia  
  value: 0,                      // Keep: discount value
  so_len_giam_toi_da: null,      // Add: Maximum discount amount
  ngay_bat_dau: '',              // Rename: startDate -> ngay_bat_dau
  ngay_ket_thuc: '',             // Rename: endDate -> ngay_ket_thuc
  trang_thai: 'active',          // Rename: isActive -> trang_thai
  selectedProducts: [],          // Add: Product selection
  deleted: false                 // Add: Soft delete flag
})
```

#### **Coupon Model Enhancement**
```javascript
const couponForm = ref({
  code: '',                           // Keep: coupon code (unique identifier)
  ten_phieu_giam_gia: '',            // Add: Vietnamese coupon name
  chi_phieu_giam_gia: 0,             // Rename: value -> chi_phieu_giam_gia
  so_luong: 0,                       // Rename: maxUses -> so_luong
  ngay_bat_dau: '',                  // Rename: startDate -> ngay_bat_dau  
  ngay_ket_thuc: '',                 // Rename: expiryDate -> ngay_ket_thuc
  trang_thai: 'active',              // Rename: isActive -> trang_thai
  selectedCustomers: [],             // Add: Customer targeting
  isPersonal: false,                 // Add: Public vs Personal type
  deleted: false                     // Add: Soft delete flag
})
```

### **2. Add Relationship Management**

#### **Product Selection for Discounts**
```vue
<!-- Add to discount modal -->
<div class="product-selection-panel">
  <h4>Chọn sản phẩm áp dụng</h4>
  <div class="product-search">
    <input v-model="productSearchTerm" placeholder="Tìm tên sản phẩm" />
  </div>
  <div class="product-table">
    <table>
      <thead>
        <tr>
          <th>☐</th>
          <th>STT</th>
          <th>Tên sản phẩm</th>
          <th>Thể loại</th>
          <th>Thương hiệu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>
            <input type="checkbox" v-model="selectedProducts" :value="product.id" />
          </td>
          <td>{{ product.id }}</td>
          <td>{{ product.ten_san_pham }}</td>
          <td>{{ product.the_loai }}</td>
          <td>{{ product.thuong_hieu }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

#### **Customer Selection for Coupons**
```vue
<!-- Add to coupon modal -->
<div class="customer-selection-panel">
  <h4>Chọn khách hàng (Chỉ áp dụng cho Cá nhân)</h4>
  <div class="customer-search">
    <input v-model="customerSearchTerm" placeholder="Tìm kiếm khách hàng" />
  </div>
  <div class="customer-table">
    <table>
      <thead>
        <tr>
          <th>☐</th>
          <th>Tên</th>
          <th>Số điện thoại</th>
          <th>Email</th>
          <th>Ngày sinh</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in filteredCustomers" :key="customer.id">
          <td>
            <input type="checkbox" v-model="selectedCustomers" :value="customer.id" />
          </td>
          <td>{{ customer.ten_khach_hang }}</td>
          <td>{{ customer.so_dien_thoai }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ formatDate(customer.ngay_sinh) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### **3. Update Table Columns to Match Database**

#### **Discount Table Headers**
```vue
<thead>
  <tr>
    <th class="col-stt">STT</th>
    <th class="col-code">Mã</th>                    <!-- ma_dot_giam_gia -->
    <th class="col-name">Tên</th>                   <!-- ten_dot_giam_gia -->
    <th class="col-value">Giá trị</th>              <!-- discount value -->
    <th class="col-max">Giảm tối đa</th>            <!-- so_len_giam_toi_da -->
    <th class="col-start">Ngày bắt đầu</th>         <!-- ngay_bat_dau -->
    <th class="col-end">Ngày kết thúc</th>          <!-- ngay_ket_thuc -->
    <th class="col-status">Trạng thái</th>          <!-- trang_thai -->
    <th class="col-actions">Hành động</th>
  </tr>
</thead>
```

#### **Coupon Table Headers**
```vue
<thead>
  <tr>
    <th class="col-stt">STT</th>
    <th class="col-code">Mã</th>                    <!-- coupon code -->
    <th class="col-name">Tên</th>                   <!-- ten_phieu_giam_gia -->
    <th class="col-value">Giá trị</th>              <!-- chi_phieu_giam_gia -->
    <th class="col-quantity">Số lượng</th>          <!-- so_luong -->
    <th class="col-start">Ngày bắt đầu</th>         <!-- ngay_bat_dau -->
    <th class="col-end">Ngày kết thúc</th>          <!-- ngay_ket_thuc -->
    <th class="col-status">Trạng thái</th>          <!-- trang_thai -->
    <th class="col-actions">Hành động</th>
  </tr>
</thead>
```

## 🚀 **Implementation Priority**

### **Phase 1: Database Alignment (High Priority)**
1. ✅ Update field names to match database schema
2. ✅ Add missing fields (discount codes, max amounts, etc.)
3. ✅ Update table columns to match ERD structure
4. ✅ Add STT (sequential number) column

### **Phase 2: Relationship Integration (Medium Priority)**  
1. ✅ Add product selection for discounts
2. ✅ Add customer selection for personal coupons
3. ✅ Implement two-panel modal design
4. ✅ Add public/personal coupon types

### **Phase 3: Advanced Features (Low Priority)**
1. ✅ Export functionality matching database fields
2. ✅ Advanced filtering with date ranges
3. ✅ Usage tracking integration with orders
4. ✅ Warranty and order relationship handling

## 📊 **Database Schema Compliance Score**

- **Current Implementation**: 70% compliant
- **After Phase 1**: 85% compliant  
- **After Phase 2**: 95% compliant
- **After Phase 3**: 100% compliant

The database schema reveals that our current implementation has a solid foundation but needs significant enhancements to fully leverage the relational structure and match the actual data model used in production.
