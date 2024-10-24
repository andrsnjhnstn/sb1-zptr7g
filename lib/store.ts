import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from './types'

interface ProductStore {
  products: Product[]
  addProduct: (product: Product) => void
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
    }),
    {
      name: 'product-store',
    }
  )
)