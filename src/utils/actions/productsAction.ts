'use server'
import api from '@/lib/axios'
const API_PATH = '/products'

export const fetchProducts = async (params: {
  categorySlug?: string[]
  sponsored?: string
  filter?: any
  page?: number
  limit?: number
  cartSimilarProducts?: boolean
  userId?: string
}) => {
  const {
    sponsored = '',
    filter,
    categorySlug = '',
    page,
    cartSimilarProducts,
    userId,
    limit
  } = params

  const stringFilter = filter ? JSON.stringify(filter) : ''

  let url = `${API_PATH}?category=${categorySlug}&sponsored=${sponsored}&filter=${stringFilter}&page=${page ?? 1}`

  if (limit) {
    url += `&limit=${limit}`
  }

  if (cartSimilarProducts) {
    url += `&cartSimilarProducts=true`

    // ✅ Only add userId if it's present and truthy
    if (userId) {
      url += `&userId=${userId}`
    }
  }

  return api
    .get(url)
    .then(res => res.data)
    .catch(err => {
      throw err
    })
}

export const fetchProductsById = async ({
  slug,
  addressId,
  zipCode
}: {
  slug: string
  addressId: string | undefined
  zipCode: string | undefined
}) => {
  return await api
    .get(`/product?slug=${slug}&addressId=${addressId}&zipCode=${zipCode}`)
    .then(res => {
      const product = res.data

      if (!product?.variations?.length) return { ...product, variations: [] }

      const variations = product?.variations

      return { ...product, current: variations[0], variations }
    })
    .catch(e => {
      throw e
    })
}

export const fetchProductForSeo = async (slug: string) => {
  return await api
    .get(`${API_PATH}/seo/${slug}`)
    .then(res => {
      return res.data
    })
    .catch(() => {
      return {}
    })
}
