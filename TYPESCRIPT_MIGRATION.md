# TypeScript Migration Guide for DATN_GearUp

## Phase 1: Initial Setup (Current Priority)

### 1. Install TypeScript Dependencies
```bash
npm install --save-dev typescript @types/node vue-tsc
```

### 2. Create tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Type Definitions for Your Project

#### API Response Types
```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
```

#### Domain Models
```typescript
// src/types/models.ts
export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  images: string[]
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: Address
  purchaseHistory: Order[]
  createdAt: Date
}

export interface Order {
  id: string
  customerId: string
  products: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'cash' | 'card' | 'transfer'
  createdAt: Date
}
```

## Phase 2: Component Migration Strategy

### Start with New Components
1. All new components should use TypeScript
2. Use `.vue` files with `<script setup lang="ts">`
3. Define props with proper types

### Example Component with TypeScript
```vue
<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import type { Product } from '@/types/models'

// Props with TypeScript
const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

// Emits with TypeScript
const emit = defineEmits<{
  'update': [product: Product]
  'delete': [id: string]
}>()

// Typed reactive state
const editMode = ref<boolean>(false)
const formData = ref<Partial<Product>>({
  name: props.product.name,
  price: props.product.price
})

// Typed computed
const formattedPrice = computed<string>(() => {
  return `$${props.product.price.toFixed(2)}`
})

// Typed functions
const updateProduct = async (): Promise<void> => {
  try {
    // Implementation
    emit('update', { ...props.product, ...formData.value } as Product)
  } catch (error) {
    console.error(error)
  }
}
</script>
```

## Phase 3: Gradual Migration of Existing Code

### Priority Order:
1. **Services** - Easy to migrate, high impact
2. **Stores** - Central state management
3. **Composables** - Reusable logic
4. **Components** - Migrate as you update them

### Service Migration Example
```typescript
// services/productService.ts
import { api } from './api'
import type { Product, ApiResponse, PaginatedResponse } from '@/types'

export const productService = {
  async getAll(params?: Record<string, any>): Promise<PaginatedResponse<Product>> {
    return api.get('/products', { params })
  },
  
  async getById(id: string): Promise<Product> {
    return api.get(`/products/${id}`)
  },
  
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return api.post('/products', productData)
  },
  
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    return api.put(`/products/${id}`, updates)
  },
  
  async delete(id: string): Promise<void> {
    return api.delete(`/products/${id}`)
  }
}
```

## Benefits of TypeScript in Your Project

1. **Catch Errors Early**: Type checking prevents runtime errors
2. **Better IDE Support**: IntelliSense, auto-completion, refactoring
3. **Self-Documenting Code**: Types serve as inline documentation
4. **Safer Refactoring**: Changes propagate through type system
5. **Team Collaboration**: Clear contracts between components

## Migration Timeline

- **Week 1**: Setup TypeScript, create type definitions
- **Week 2**: Migrate services and API layer
- **Week 3**: Migrate stores to TypeScript
- **Week 4**: Start migrating critical components
- **Ongoing**: Migrate components as they're updated

## Resources

- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vue TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/vue)
