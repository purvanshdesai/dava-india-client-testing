import type { Metadata } from 'next'
import ProductView from '@/components/Products/ProductView'
import { fetchProductForSeo } from '@/utils/actions/productsAction'

type Props = {
  params: Promise<{ productId: string }>
}

// Dynamic Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { productId } = await params

  const product = await fetchProductForSeo(productId)

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.thumbnail ? [product.thumbnail] : undefined
    }
  }
}

export default function ProductDetails() {
  return <ProductView />
}
