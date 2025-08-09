// Mock dữ liệu Sản phẩm: dùng khi backend chưa sẵn sàng
// Ghi chú: chỉ phục vụ mục đích UI/UX, không phải dữ liệu thật

const placeholder = '/placeholder-shoe.jpg'

export const mockProducts = [
  {
    id: 'p1',
    name: 'Nike Air Zoom Pegasus 40',
    brand: 'nike',
    category: 'sneakers',
    price: 2990000,
    stock: 12,
    image: placeholder,
    images: [placeholder],
    description: 'Giày chạy bộ êm ái, phù hợp tập luyện hằng ngày.'
  },
  {
    id: 'p2',
    name: 'Adidas Ultraboost 22',
    brand: 'adidas',
    category: 'sneakers',
    price: 3890000,
    stock: 8,
    image: placeholder,
    images: [placeholder],
    description: 'Đệm Boost hoàn trả lực, trải nghiệm êm ái.'
  },
  {
    id: 'p3',
    name: 'Puma RS-X',
    brand: 'puma',
    category: 'sneakers',
    price: 2490000,
    stock: 0,
    image: placeholder,
    images: [placeholder],
    description: 'Thiết kế retro cá tính, phối màu nổi bật.'
  },
  {
    id: 'p4',
    name: 'Converse Chuck 70',
    brand: 'converse',
    category: 'sneakers',
    price: 1890000,
    stock: 23,
    image: placeholder,
    images: [placeholder],
    description: 'Huyền thoại đường phố, bền bỉ và dễ phối đồ.'
  },
  {
    id: 'p5',
    name: 'Nike Air Force 1 ’07',
    brand: 'nike',
    category: 'sneakers',
    price: 2790000,
    stock: 5,
    image: placeholder,
    images: [placeholder],
    description: 'Iconic AF1, da tổng hợp, form dễ mang.'
  },
  {
    id: 'p6',
    name: 'Adidas Stan Smith',
    brand: 'adidas',
    category: 'formal',
    price: 2190000,
    stock: 18,
    image: placeholder,
    images: [placeholder],
    description: 'Tối giản, thanh lịch, phù hợp nhiều hoàn cảnh.'
  },
  {
    id: 'p7',
    name: 'Puma Cali',
    brand: 'puma',
    category: 'sandals',
    price: 1590000,
    stock: 9,
    image: placeholder,
    images: [placeholder],
    description: 'Phong cách California, thoáng mát, linh hoạt.'
  },
  {
    id: 'p8',
    name: 'Converse Run Star Hike',
    brand: 'converse',
    category: 'boots',
    price: 2990000,
    stock: 7,
    image: placeholder,
    images: [placeholder],
    description: 'Đế răng cưa đặc trưng, chất chơi và khác biệt.'
  }
]

const normalize = s =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const applyProductFilters = (
  list,
  { q, brand, category, sort, minPrice, maxPrice, inStockOnly } = {}
) => {
  let result = [...list]
  if (q) {
    const query = normalize(q)
    result = result.filter(p => normalize(p.name).includes(query))
  }
  if (brand) {
    result = result.filter(p => p.brand === brand)
  }
  if (category) {
    result = result.filter(p => p.category === category)
  }
  if (typeof minPrice !== 'undefined' && minPrice !== null && minPrice !== '') {
    const min = Number(minPrice) || 0
    result = result.filter(p => p.price >= min)
  }
  if (typeof maxPrice !== 'undefined' && maxPrice !== null && maxPrice !== '') {
    const max = Number(maxPrice) || Number.MAX_SAFE_INTEGER
    result = result.filter(p => p.price <= max)
  }
  if (inStockOnly) {
    result = result.filter(p => p.stock > 0)
  }
  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  }
  return result
}

export const mockOk = data => Promise.resolve({ status: 200, data })
export const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))
