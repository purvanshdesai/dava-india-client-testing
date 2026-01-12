import { create } from 'zustand'
import {
  ProductViewStore,
  Product,
  ProductVariation
} from '../../types/storeTypes'

const useProductViewStore = create<ProductViewStore>(set => ({
  product: null,
  variation: null,
  variations: [],
  setProductView: (product: Product) => {
    const { current, variations } = product

    set({ variation: current, variations, product })
  },
  setCurrentProductVariation: (variation: ProductVariation) => {
    set({ variation: variation })
  }
}))

export default useProductViewStore
