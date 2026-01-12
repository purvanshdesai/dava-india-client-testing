import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchProductsById } from '../actions/productsAction'

export const useFetchProducts = (params: {
  categorySlug?: string[]
  sponsored?: string
  filter?: any
  page?: any
  limit?: any
  cartSimilarProducts?: boolean
  userId?: string
}) => {
  const { sponsored, filter, categorySlug, page, limit } = params
  return useQuery({
    queryKey: ['find-products', sponsored, filter, categorySlug, page, limit],
    queryFn: () => fetchProducts(params)
  })
}

export const useFetchProductsById = (
  slug: string,
  addressId: string | undefined,
  zipCode: string | undefined
) => {
  return useQuery({
    queryKey: ['fetch-products', slug, addressId, zipCode],
    queryFn: () => fetchProductsById({ slug, addressId, zipCode })
  })
}
