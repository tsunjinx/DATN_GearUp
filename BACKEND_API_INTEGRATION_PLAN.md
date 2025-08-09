# 🚀 Backend API Integration Plan for Enhanced DATN_GearUp Admin

## Executive Summary
This document outlines the comprehensive API requirements for the enhanced admin system that now fully supports the sophisticated footwear e-commerce ERD. The frontend now includes advanced views for product variants, attributes, warranties, and more - requiring corresponding backend API endpoints.

## 🔥 CRITICAL: New API Endpoints Required

### 1. Product Variant Management APIs (`sản_phẩm_chi_tiết`)

#### Core Endpoints
```bash
# Product Variants CRUD
GET    /api/admin/product-variants              # List all variants with filters
POST   /api/admin/product-variants              # Create single variant
GET    /api/admin/product-variants/{id}         # Get variant details
PUT    /api/admin/product-variants/{id}         # Update variant
DELETE /api/admin/product-variants/{id}         # Soft delete variant

# Product-specific variants
GET    /api/admin/products/{id}/variants        # Get variants for specific product
POST   /api/admin/products/{id}/variants/matrix # Create size/color matrix

# Bulk operations
POST   /api/admin/product-variants/bulk         # Bulk create variants
PUT    /api/admin/product-variants/bulk-update  # Bulk update variants
PUT    /api/admin/product-variants/bulk-stock   # Bulk stock update
```

#### Request/Response Formats
```json
// POST /api/admin/product-variants
{
  "id_sản_phẩm": 1,
  "id_mau_sac": 2,
  "id_kich_thuoc": 3,
  "id_gia_pham": 1,
  "ma_san_pham": "NIKE-AF1-WHITE-42",
  "ten_san_pham": "Nike Air Force 1 - Trắng - 42",
  "price": 2500000,
  "stock": 100,
  "id_chat_lieu": 1,
  "id_de_giay": 2,
  "id_dem_giay": 1,
  "id_trong_luong": 3,
  "id_mon_the_thao": 1,
  "id_loai_mua": 2,
  "id_do_ben": 1,
  "id_chong_nuoc": 3,
  "id_nha_san_xuat": 1,
  "id_xuat_xu": 1
}
```

### 2. Footwear Attributes APIs (All ERD Attribute Entities)

#### Attribute Types
- `màu_sắc` (colors)
- `kich_thuoc` (sizes)
- `chât_liệu` (materials)
- `dạ_giày` (sole types)
- `dém_giày` (insole types)
- `trung_luong` (weights)
- `mùa_thể_thao` (sports seasons)
- `loại_mũa` (rain types)
- `đỗ_bền` (durabilities)
- `chống_nước` (waterproof levels)

#### Unified Attribute Endpoints
```bash
# Generic attribute management
GET    /api/admin/attributes/{type}             # Get all attributes of type
POST   /api/admin/attributes/{type}             # Create new attribute
PUT    /api/admin/attributes/{type}/{id}        # Update attribute
DELETE /api/admin/attributes/{type}/{id}        # Soft delete attribute

# Specific examples:
GET    /api/admin/attributes/colors             # Get all colors
GET    /api/admin/attributes/sizes              # Get all sizes
GET    /api/admin/attributes/materials          # Get all materials
```

#### Sample Color Attribute
```json
{
  "id": 1,
  "ma_mau_sac": "#FF0000",
  "ten_mau_sac": "Đỏ",
  "deleted": false,
  "created_at": "2024-01-08T10:00:00Z",
  "updated_at": "2024-01-08T10:00:00Z"
}
```

### 3. Warranty Management APIs (`phiếu_bảo_hành` & `kích_thử_bảo_hành`)

#### Warranty Endpoints
```bash
# Warranty management
GET    /api/admin/warranties                    # List warranties with filters
POST   /api/admin/warranties                    # Create warranty
GET    /api/admin/warranties/{id}               # Get warranty details
PUT    /api/admin/warranties/{id}               # Update warranty
DELETE /api/admin/warranties/{id}               # Delete warranty

# Warranty repairs
GET    /api/admin/warranty-repairs              # List repairs
POST   /api/admin/warranty-repairs              # Create repair record
PUT    /api/admin/warranty-repairs/{id}         # Update repair
DELETE /api/admin/warranty-repairs/{id}         # Delete repair

# Analytics
GET    /api/admin/warranties/expiring           # Get expiring warranties
GET    /api/admin/warranties/stats              # Get warranty statistics
```

#### Warranty Request Format
```json
{
  "id_chi_tiet_san_pham": 123,
  "ma_bao_hanh": "WTY-2024-001",
  "ngày_bat_đau": "2024-01-08",
  "ngày_hết_han": "2025-01-08",
  "trang_thai": "active"
}
```

### 4. Manufacturer & Origin APIs (`nhà_sản_xuất` & `xuất_xu`)

```bash
# Manufacturers
GET    /api/admin/manufacturers                 # List manufacturers
POST   /api/admin/manufacturers                 # Create manufacturer
PUT    /api/admin/manufacturers/{id}            # Update manufacturer
DELETE /api/admin/manufacturers/{id}            # Delete manufacturer

# Origins
GET    /api/admin/origins                       # List origins
POST   /api/admin/origins                       # Create origin
PUT    /api/admin/origins/{id}                  # Update origin
DELETE /api/admin/origins/{id}                  # Delete origin
```

### 5. Enhanced Voucher APIs (`phiếu_giảm_giá` & `phiếu_giảm_giá_cá_nhân`)

```bash
# Public vouchers
GET    /api/admin/vouchers                      # List public vouchers
POST   /api/admin/vouchers                      # Create voucher
PUT    /api/admin/vouchers/{id}                 # Update voucher
DELETE /api/admin/vouchers/{id}                 # Delete voucher

# Personal vouchers
GET    /api/admin/personal-vouchers             # List personal vouchers
POST   /api/admin/personal-vouchers             # Create personal voucher
POST   /api/admin/personal-vouchers/bulk        # Bulk create for customers
POST   /api/admin/vouchers/assign               # Assign voucher to customers
```

## 🗄️ Database Migration Requirements

### New Tables Needed (if not existing)
```sql
-- Ensure all ERD entities exist with exact Vietnamese field names:
- xuất_xu (origins)
- nhà_sản_xuất (manufacturers)  
- màu_sắc (colors)
- kich_thuoc (sizes)
- chât_liệu (materials)
- dạ_giày (sole types)
- dém_giày (insole types)
- trung_luong (weights)
- mùa_thể_thao (sports seasons)
- loại_mũa (rain types)
- đỗ_bền (durabilities)
- chống_nước (waterproof levels)
- sản_phẩm_chi_tiết (product variants)
- phiếu_bảo_hành (warranties)
- kích_thử_bảo_hành (warranty repairs)
- phiếu_giảm_giá (vouchers)
- phiếu_giảm_giá_cá_nhân (personal vouchers)
```

### Foreign Key Relationships
```sql
-- sản_phẩm_chi_tiết relationships to all attribute tables
ALTER TABLE sản_phẩm_chi_tiết ADD FOREIGN KEY (id_mau_sac) REFERENCES màu_sắc(id);
ALTER TABLE sản_phẩm_chi_tiết ADD FOREIGN KEY (id_kich_thuoc) REFERENCES kich_thuoc(id);
-- ... (all other attribute relationships from ERD)
```

## 📊 API Response Format Standards

### Standardized Response Structure
```json
{
  "success": true,
  "data": {}, // or []
  "message": "Success",
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "last_page": 5
  },
  "meta": {
    "timestamp": "2024-01-08T10:00:00Z",
    "version": "1.0"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "ten_mau_sac": ["Tên màu sắc là bắt buộc"]
    }
  }
}
```

## 🔐 Authentication & Authorization

### Required Headers
```bash
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

### Role-Based Access Control
```json
{
  "admin": ["*"], // Full access
  "manager": ["read", "create", "update"],
  "employee": ["read"]
}
```

## 📈 Performance Requirements

### Response Time Targets
- List endpoints: < 200ms
- Detail endpoints: < 100ms  
- Bulk operations: < 2s
- Search endpoints: < 300ms

### Pagination & Filtering
```bash
# Standard query parameters
?page=1&per_page=20&sort=created_at&order=desc
?search=nike&status=active&category_id=1
?created_from=2024-01-01&created_to=2024-01-31
```

## 🧪 Testing Requirements

### API Test Coverage
- [ ] Unit tests for all endpoints
- [ ] Integration tests for complex workflows
- [ ] Performance tests for bulk operations
- [ ] Error handling tests
- [ ] Authentication/authorization tests

### Test Data Requirements
```json
{
  "colors": 20,
  "sizes": 15,
  "materials": 10,
  "products": 50,
  "variants": 500,
  "warranties": 100,
  "repairs": 50
}
```

## 🚀 Deployment Checklist

### Backend Readiness
- [ ] All ERD entities implemented with exact Vietnamese field names
- [ ] API endpoints implemented and tested
- [ ] Database migrations ready
- [ ] Soft delete implemented for all entities  
- [ ] Authentication & authorization working
- [ ] Error handling & validation implemented
- [ ] Performance optimization completed
- [ ] API documentation generated

### Frontend Integration
- [ ] ✅ Enhanced admin views created
- [ ] ✅ Comprehensive Pinia stores implemented
- [ ] ✅ Router updated with new routes
- [ ] ✅ Navigation updated in AdminLayout
- [ ] API integration testing completed
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] User feedback mechanisms working

## 📋 Priority Implementation Order

### Phase 1: Core Foundation (Week 1)
1. Implement all attribute management APIs
2. Create product variant CRUD APIs
3. Set up manufacturer/origin APIs

### Phase 2: Advanced Features (Week 2)  
1. Implement warranty management APIs
2. Create enhanced voucher APIs
3. Add bulk operation endpoints

### Phase 3: Optimization (Week 3)
1. Performance optimization
2. Advanced filtering/search
3. Analytics endpoints
4. Integration testing

## 🔧 Environment Configuration

### Required Environment Variables
```bash
DB_CONNECTION=mysql
DB_HOST=localhost  
DB_PORT=3306
DB_DATABASE=datn_gearup
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
API_VERSION=v1
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

## 📞 Support & Contact

For backend implementation questions or API design clarification:
- Review this integration plan
- Check the database_schema.json for exact field names
- Ensure all Vietnamese field names match the ERD exactly
- Test all endpoints with the enhanced frontend views

---

**Status**: Ready for backend implementation
**Frontend Status**: ✅ Complete with comprehensive ERD support
**Expected Backend Completion**: 2-3 weeks

