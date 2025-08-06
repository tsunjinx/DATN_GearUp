# 🏷️ Brand Logo Implementation Guide

## Current Implementation
The Products view now displays actual brand logos instead of text-only badges in the brand column.

## Current Brand Logos
Located in `/public/brand-logos/`:
- `nike.svg` - Nike swoosh logo
- `adidas.svg` - Adidas three stripes  
- `puma.svg` - Puma cat logo
- `converse.svg` - Converse star logo

## How It Works

### Table View
```vue
<div class="brand-logo-cell">
  <img 
    :src="getBrandLogo(product.brand)" 
    :alt="getBrandName(product.brand)"
    class="brand-logo"
    @error="handleBrandLogoError"
  />
  <span class="brand-name">{{ getBrandName(product.brand) }}</span>
</div>
```

### Grid View  
```vue
<div class="product-grid-brand">
  <img 
    :src="getBrandLogo(product.brand)" 
    :alt="getBrandName(product.brand)"
    class="brand-logo-small"
    @error="handleBrandLogoError"
  />
  <span class="brand-name-small">{{ getBrandName(product.brand) }}</span>
</div>
```

## Adding New Brands

### Step 1: Add Logo File
Save the brand logo as `/public/brand-logos/[brand-key].svg`

### Step 2: Update Brand Functions
```javascript
const getBrandName = (brand) => {
  const brands = {
    nike: 'Nike',
    adidas: 'Adidas', 
    puma: 'Puma',
    converse: 'Converse',
    newBalance: 'New Balance', // Add new brand
    vans: 'Vans'               // Add new brand
  }
  return brands[brand] || brand
}

const getBrandLogo = (brand) => {
  const brandLogos = {
    nike: '/brand-logos/nike.svg',
    adidas: '/brand-logos/adidas.svg',
    puma: '/brand-logos/puma.svg', 
    converse: '/brand-logos/converse.svg',
    newBalance: '/brand-logos/new-balance.svg', // Add new brand
    vans: '/brand-logos/vans.svg'               // Add new brand
  }
  return brandLogos[brand] || '/brand-logos/default.svg'
}
```

## Backend Integration (Future)

When your backend is ready, you can modify the system to:

### Option 1: Store Logo URLs in Database
```javascript
// In your product model/database
{
  id: 1,
  name: "Nike Air Max",
  brand: "nike",
  brandLogoUrl: "https://your-cdn.com/logos/nike.svg", // Add this field
  // ... other fields
}

// Update the component
const getBrandLogo = (product) => {
  return product.brandLogoUrl || `/brand-logos/${product.brand}.svg`
}
```

### Option 2: Brand Management System
Create a brands table/collection:
```javascript
// Brands collection
{
  id: 1,
  key: "nike",
  name: "Nike",
  logoUrl: "https://your-cdn.com/logos/nike-official.svg",
  websiteUrl: "https://nike.com",
  description: "Just Do It"
}

// Use in components
const brandStore = useBrandStore()
const getBrandLogo = (brandKey) => {
  const brand = brandStore.getBrand(brandKey)
  return brand?.logoUrl || `/brand-logos/${brandKey}.svg`
}
```

### Option 3: Upload Brand Logos
```javascript
// Add to admin interface
const uploadBrandLogo = async (brandKey, logoFile) => {
  const formData = new FormData()
  formData.append('logo', logoFile)
  formData.append('brand', brandKey)
  
  const response = await brandService.uploadLogo(formData)
  return response.logoUrl
}
```

## Logo Specifications

### Recommended Format
- **File Type**: SVG (preferred) or PNG with transparency
- **Dimensions**: 40x20px (2:1 ratio) for table view
- **File Size**: < 10KB for optimal performance
- **Background**: Transparent or white

### Design Guidelines
- Keep logos simple and recognizable
- Ensure good contrast on light backgrounds
- Use brand's official colors
- Maintain aspect ratio

## Error Handling
The system includes automatic fallback:
- If logo fails to load, shows generic "BRAND" placeholder
- Graceful degradation to text-only display
- Console logging for debugging

## Performance Considerations
- All logos are in `/public` folder for fast access
- SVG format ensures scalability without quality loss
- Lazy loading can be added for large product lists
- CDN integration ready for production

## CSS Classes
- `.brand-logo-cell` - Table row brand container
- `.brand-logo` - Table view logo (40x20px)
- `.brand-logo-small` - Grid view logo (32x16px)  
- `.brand-name` - Table view brand text
- `.brand-name-small` - Grid view brand text

## Future Enhancements
- [ ] Dark mode logo variants
- [ ] Animated brand logos
- [ ] Brand filtering by logo
- [ ] Logo upload interface in admin
- [ ] Multiple logo sizes for different contexts
- [ ] Brand color palette integration
