# GearUp - Website Bán Giày

Dự án website bán giày GearUp sử dụng Vue.js 3 cho phần Frontend.

## 🚀 Tính năng chính

- **Dashboard**: Thống kê tổng quan về doanh số, sản phẩm, khách hàng
- **Quản lý Sản phẩm**: CRUD sản phẩm, phân loại theo danh mục, thương hiệu
- **Quản lý Khách hàng**: Quản lý thông tin khách hàng, trạng thái tài khoản
- **Quản lý Nhân viên**: Quản lý thông tin nhân viên, phân quyền
- **Quản lý Hóa đơn**: Theo dõi đơn hàng, cập nhật trạng thái
- **Quản lý Đợt giảm giá**: Tạo và quản lý các chương trình khuyến mãi
- **Quản lý Phiếu giảm giá**: Tạo và quản lý mã giảm giá

## 🛠️ Công nghệ sử dụng

- **Frontend**: Vue.js 3 + Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **CSS**: CSS3 với responsive design

## 📁 Cấu trúc thư mục

```
src/
├── assets/           # Tài nguyên tĩnh (hình ảnh, icons)
├── components/       # Component tái sử dụng
├── layouts/          # Layout components
├── router/           # Cấu hình Vue Router
├── services/         # API services
├── stores/           # Pinia stores
├── utils/            # Utility functions
├── views/            # Các trang chính
├── App.vue           # Component gốc
├── main.js           # Entry point
└── style.css         # Global styles
```

## 🔧 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm hoặc yarn

### Các bước cài đặt

1. **Cài đặt dependencies**
```bash
npm install
```

2. **Chạy development server**
```bash
npm run dev
```

3. **Build cho production**
```bash
npm run build
```

4. **Preview build**
```bash
npm run preview
```

## 🎯 Các trang chính

- **Dashboard** (`/`): Thống kê tổng quan, biểu đồ doanh thu
- **Sản phẩm** (`/products`): Quản lý sản phẩm với tìm kiếm và lọc
- **Khách hàng** (`/customers`): Quản lý thông tin khách hàng
- **Nhân viên** (`/employees`): Quản lý nhân viên và phân quyền
- **Hóa đơn** (`/orders`): Quản lý đơn hàng và trạng thái
- **Đợt giảm giá** (`/discounts`): Tạo chương trình khuyến mãi
- **Phiếu giảm giá** (`/coupons`): Tạo và quản lý mã giảm giá
