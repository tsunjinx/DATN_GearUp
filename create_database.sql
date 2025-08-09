-- =============================================
-- DATN_GearUp Database Creation Script
-- MS SQL Server Implementation
-- Based on ERD Analysis
-- =============================================

-- Create Database
CREATE DATABASE DATN_GearUp;
GO

USE DATN_GearUp;
GO

-- =============================================
-- LOOKUP/REFERENCE TABLES
-- =============================================

-- Table: xuất_xu (Origin/Source)
CREATE TABLE xuat_xu (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ten_xuat_xu NVARCHAR(255) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: nhà_sản_xuất (Manufacturer)
CREATE TABLE nha_san_xuat (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_nha_san_xuat NVARCHAR(50) UNIQUE NOT NULL,
    ten_nha_san_xuat NVARCHAR(255) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: màu_sắc (Color)
CREATE TABLE mau_sac (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_mau_sac NVARCHAR(50) UNIQUE NOT NULL,
    ten_mau_sac NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: kích_thước (Size)
CREATE TABLE kich_thuoc (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_kich_thuoc NVARCHAR(50) UNIQUE NOT NULL,
    ten_kich_thuoc NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: đế_giày (Shoe Sole)
CREATE TABLE de_giay (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_de_giay NVARCHAR(50) UNIQUE NOT NULL,
    ten_de_giay NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: chất_liệu (Material)
CREATE TABLE chat_lieu (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_chat_lieu NVARCHAR(50) UNIQUE NOT NULL,
    ten_chat_lieu NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: đệm_giày (Shoe Cushion)
CREATE TABLE dem_giay (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ten_dem_giay NVARCHAR(100) NOT NULL,
    ten_de_giay NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: trọng_lượng (Weight)
CREATE TABLE trong_luong (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_trong_luong NVARCHAR(50) UNIQUE NOT NULL,
    ten_trong_luong NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: môn_thể_thao (Sport Type)
CREATE TABLE mon_the_thao (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_mon_the_thao NVARCHAR(50) UNIQUE NOT NULL,
    ten_mon_the_thao NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: loại_mùa (Season Type)
CREATE TABLE loai_mua (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_loai_mua NVARCHAR(50) UNIQUE NOT NULL,
    ten_loai_mua NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: độ_bền (Durability)
CREATE TABLE do_ben (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_do_ben NVARCHAR(50) UNIQUE NOT NULL,
    ten_do_ben NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: chống_nước (Water Resistance)
CREATE TABLE chong_nuoc (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_chong_nuoc NVARCHAR(50) UNIQUE NOT NULL,
    ten_chong_nuoc NVARCHAR(100) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- =============================================
-- MAIN BUSINESS TABLES
-- =============================================

-- Table: sản_phẩm (Product)
CREATE TABLE san_pham (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_nha_san_xuat INT NOT NULL,
    id_xuat_xu INT NOT NULL,
    duong_dan_anh NVARCHAR(500),
    ten_san_pham NVARCHAR(255) NOT NULL,
    mo_ta NTEXT,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_nha_san_xuat) REFERENCES nha_san_xuat(id),
    FOREIGN KEY (id_xuat_xu) REFERENCES xuat_xu(id)
);

-- Table: đợt_giảm_giá (Discount Period)
CREATE TABLE dot_giam_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_dot_giam_gia NVARCHAR(50) UNIQUE NOT NULL,
    ten_dot_giam_gia NVARCHAR(255) NOT NULL,
    so_luong_giam_toi_da DECIMAL(5,2) NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai NVARCHAR(50) DEFAULT 'ACTIVE',
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: sản_phẩm_chi_tiết (Product Detail)
CREATE TABLE san_pham_chi_tiet (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_san_pham INT NOT NULL,
    id_mau_sac INT NOT NULL,
    id_kich_thuoc INT NOT NULL,
    id_de_giay INT NOT NULL,
    id_chat_lieu INT NOT NULL,
    id_dem_giay INT NOT NULL,
    id_trong_luong INT NOT NULL,
    id_mon_the_thao INT NOT NULL,
    id_loai_mua INT NOT NULL,
    id_do_ben INT NOT NULL,
    id_chong_nuoc INT NOT NULL,
    id_dot_giam_gia INT,
    ma_san_pham_chi_tiet NVARCHAR(100) UNIQUE NOT NULL,
    ten_san_pham_chi_tiet NVARCHAR(255) NOT NULL,
    gia_ban DECIMAL(18,2) NOT NULL,
    so_luong_ton_kho INT DEFAULT 0,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_san_pham) REFERENCES san_pham(id),
    FOREIGN KEY (id_mau_sac) REFERENCES mau_sac(id),
    FOREIGN KEY (id_kich_thuoc) REFERENCES kich_thuoc(id),
    FOREIGN KEY (id_de_giay) REFERENCES de_giay(id),
    FOREIGN KEY (id_chat_lieu) REFERENCES chat_lieu(id),
    FOREIGN KEY (id_dem_giay) REFERENCES dem_giay(id),
    FOREIGN KEY (id_trong_luong) REFERENCES trong_luong(id),
    FOREIGN KEY (id_mon_the_thao) REFERENCES mon_the_thao(id),
    FOREIGN KEY (id_loai_mua) REFERENCES loai_mua(id),
    FOREIGN KEY (id_do_ben) REFERENCES do_ben(id),
    FOREIGN KEY (id_chong_nuoc) REFERENCES chong_nuoc(id),
    FOREIGN KEY (id_dot_giam_gia) REFERENCES dot_giam_gia(id)
);

-- Table: quyền_hạn (Permissions/Roles)
CREATE TABLE quyen_han (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_quyen_han NVARCHAR(50) UNIQUE NOT NULL,
    ten_quyen_han NVARCHAR(100) NOT NULL,
    mo_ta NVARCHAR(255),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: nhân_viên (Employee)
CREATE TABLE nhan_vien (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_quyen_han INT NOT NULL,
    ma_nhan_vien NVARCHAR(50) UNIQUE NOT NULL,
    ten_nhan_vien NVARCHAR(255) NOT NULL,
    ten_tai_khoan NVARCHAR(100) UNIQUE NOT NULL,
    mat_khau NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    so_dien_thoai NVARCHAR(20),
    anh_nhan_vien NVARCHAR(500),
    ngay_sinh DATE,
    gioi_tinh NVARCHAR(10),
    dia_chi NVARCHAR(500),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    created_by NVARCHAR(100),
    updated_at DATETIME DEFAULT GETDATE(),
    updated_by NVARCHAR(100),
    FOREIGN KEY (id_quyen_han) REFERENCES quyen_han(id)
);

-- Table: khách_hàng (Customer)
CREATE TABLE khach_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ten_khach_hang NVARCHAR(255) NOT NULL,
    ten_tai_khoan NVARCHAR(100) UNIQUE,
    email NVARCHAR(255) UNIQUE NOT NULL,
    so_dien_thoai NVARCHAR(20),
    gioi_tinh NVARCHAR(10),
    ngay_sinh DATE,
    mat_khau NVARCHAR(255),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: địa_chỉ_khách_hàng (Customer Address)
CREATE TABLE dia_chi_khach_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NOT NULL,
    ma_dia_chi NVARCHAR(50),
    dia_chi_cu_the NVARCHAR(500) NOT NULL,
    thanh_pho NVARCHAR(100) NOT NULL,
    quan NVARCHAR(100) NOT NULL,
    phuong NVARCHAR(100),
    ma_zip NVARCHAR(20),
    la_dia_chi_mac_dinh BIT DEFAULT 0,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
);

-- Table: phiếu_giảm_giá (Discount Voucher)
CREATE TABLE phieu_giam_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_phieu_giam_gia NVARCHAR(50) UNIQUE NOT NULL,
    ten_phieu_giam_gia NVARCHAR(255) NOT NULL,
    chi_tiet_giam_gia DECIMAL(18,2) NOT NULL,
    loai_giam_gia NVARCHAR(20) DEFAULT 'PERCENT', -- PERCENT or AMOUNT
    so_luong INT NOT NULL,
    gia_tri_don_hang_toi_thieu DECIMAL(18,2) DEFAULT 0,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai NVARCHAR(50) DEFAULT 'ACTIVE',
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: phiếu_giảm_giá_cá_nhân (Personal Discount Voucher)
CREATE TABLE phieu_giam_gia_ca_nhan (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NOT NULL,
    id_phieu_giam_gia INT NOT NULL,
    ten_phieu_giam_gia_ca_nhan NVARCHAR(255),
    ngay_nhan DATE DEFAULT GETDATE(),
    ngay_het_han DATE NOT NULL,
    trang_thai NVARCHAR(50) DEFAULT 'AVAILABLE', -- AVAILABLE, USED, EXPIRED
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
    FOREIGN KEY (id_phieu_giam_gia) REFERENCES phieu_giam_gia(id)
);

-- Table: trạng_thái_đơn_hàng (Order Status)
CREATE TABLE trang_thai_don_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_trang_thai_don_hang NVARCHAR(50) UNIQUE NOT NULL,
    ten_trang_thai_don_hang NVARCHAR(100) NOT NULL,
    mo_ta NVARCHAR(255),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: hóa_đơn (Invoice/Order)
CREATE TABLE hoa_don (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NOT NULL,
    id_phieu_giam_gia INT,
    id_nhan_vien INT,
    ma_hoa_don NVARCHAR(50) UNIQUE NOT NULL,
    ngay_tao_don DATE DEFAULT GETDATE(),
    tong_tien_hang DECIMAL(18,2) NOT NULL,
    tien_giam_gia DECIMAL(18,2) DEFAULT 0,
    phi_van_chuyen DECIMAL(18,2) DEFAULT 0,
    tong_tien_thanh_toan DECIMAL(18,2) NOT NULL,
    ghi_chu NVARCHAR(500),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
    FOREIGN KEY (id_phieu_giam_gia) REFERENCES phieu_giam_gia(id),
    FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id)
);

-- Table: chi_tiết_hóa_đơn (Order Details)
CREATE TABLE chi_tiet_hoa_don (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_hoa_don INT NOT NULL,
    id_san_pham_chi_tiet INT NOT NULL,
    so_luong INT NOT NULL,
    gia_ban DECIMAL(18,2) NOT NULL,
    thanh_tien DECIMAL(18,2) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id),
    FOREIGN KEY (id_san_pham_chi_tiet) REFERENCES san_pham_chi_tiet(id)
);

-- Table: thống_kê_đơn_hàng (Order Tracking)
CREATE TABLE thong_ke_don_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_hoa_don INT NOT NULL,
    id_trang_thai_don_hang INT NOT NULL,
    ma_thong_ke_don_hang NVARCHAR(50),
    ten_trang_thai_don_hang NVARCHAR(100) NOT NULL,
    thoi_gian DATETIME DEFAULT GETDATE(),
    ghi_chu NVARCHAR(500),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id),
    FOREIGN KEY (id_trang_thai_don_hang) REFERENCES trang_thai_don_hang(id)
);

-- Table: phương_thức_thanh_toán (Payment Method)
CREATE TABLE phuong_thuc_thanh_toan (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_phuong_thuc_thanh_toan NVARCHAR(50) UNIQUE NOT NULL,
    ten_phuong_thuc_thanh_toan NVARCHAR(100) NOT NULL,
    mo_ta NVARCHAR(255),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: hình_thức_thanh_toán (Payment Form)
CREATE TABLE hinh_thuc_thanh_toan (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_hoa_don INT NOT NULL,
    id_phuong_thuc_thanh_toan INT NOT NULL,
    so_tien_thanh_toan DECIMAL(18,2) NOT NULL,
    ngay_thanh_toan DATETIME DEFAULT GETDATE(),
    ma_giao_dich NVARCHAR(100),
    trang_thai NVARCHAR(50) DEFAULT 'COMPLETED',
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id),
    FOREIGN KEY (id_phuong_thuc_thanh_toan) REFERENCES phuong_thuc_thanh_toan(id)
);

-- Table: giỏ_hàng (Shopping Cart)
CREATE TABLE gio_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NOT NULL,
    ma_gio_hang NVARCHAR(50) UNIQUE,
    ngay_tao DATETIME DEFAULT GETDATE(),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
);

-- Table: chi_tiết_giỏ_hàng (Shopping Cart Details)
CREATE TABLE chi_tiet_gio_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_gio_hang INT NOT NULL,
    id_san_pham_chi_tiet INT NOT NULL,
    ma_chi_tiet_gio_hang NVARCHAR(50),
    ngay_them DATETIME DEFAULT GETDATE(),
    so_luong INT NOT NULL DEFAULT 1,
    gia_tai_thoi_diem DECIMAL(18,2) NOT NULL,
    tong_tien DECIMAL(18,2) NOT NULL,
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_gio_hang) REFERENCES gio_hang(id),
    FOREIGN KEY (id_san_pham_chi_tiet) REFERENCES san_pham_chi_tiet(id)
);

-- Table: phiếu_bảo_hành (Warranty)
CREATE TABLE phieu_bao_hanh (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_chi_tiet_hoa_don INT NOT NULL,
    ma_bao_hanh NVARCHAR(50) UNIQUE NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_het_han DATE NOT NULL,
    trang_thai NVARCHAR(50) DEFAULT 'ACTIVE',
    ghi_chu NVARCHAR(500),
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_chi_tiet_hoa_don) REFERENCES chi_tiet_hoa_don(id)
);

-- Table: lịch_sử_bảo_hành (Warranty History)
CREATE TABLE lich_su_bao_hanh (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_phieu_bao_hanh INT NOT NULL,
    ngay_bao_hanh DATE NOT NULL,
    chi_tiet_sua_chua NVARCHAR(500),
    phuong_thuc_sua_chua NVARCHAR(255),
    chi_phi DECIMAL(18,2) DEFAULT 0,
    nhan_vien_xu_ly NVARCHAR(255),
    trang_thai NVARCHAR(50) DEFAULT 'COMPLETED',
    deleted BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_phieu_bao_hanh) REFERENCES phieu_bao_hanh(id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Product indexes
CREATE INDEX IX_san_pham_nha_san_xuat ON san_pham(id_nha_san_xuat);
CREATE INDEX IX_san_pham_xuat_xu ON san_pham(id_xuat_xu);
CREATE INDEX IX_san_pham_chi_tiet_san_pham ON san_pham_chi_tiet(id_san_pham);

-- Customer indexes
CREATE INDEX IX_dia_chi_khach_hang ON dia_chi_khach_hang(id_khach_hang);
CREATE INDEX IX_hoa_don_khach_hang ON hoa_don(id_khach_hang);

-- Order indexes
CREATE INDEX IX_chi_tiet_hoa_don_hoa_don ON chi_tiet_hoa_don(id_hoa_don);
CREATE INDEX IX_thong_ke_don_hang_hoa_don ON thong_ke_don_hang(id_hoa_don);

-- Shopping cart indexes
CREATE INDEX IX_gio_hang_khach_hang ON gio_hang(id_khach_hang);
CREATE INDEX IX_chi_tiet_gio_hang ON chi_tiet_gio_hang(id_gio_hang);

-- Date-based indexes for reporting
CREATE INDEX IX_hoa_don_ngay_tao ON hoa_don(created_at);
CREATE INDEX IX_san_pham_chi_tiet_created ON san_pham_chi_tiet(created_at);

GO

PRINT 'Database DATN_GearUp created successfully!';
