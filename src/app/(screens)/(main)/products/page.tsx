import type { Metadata } from 'next'
import ProductList from '@/components/Products'

export const metadata: Metadata = {
  title: 'Dava India | Products',
  description: 'Dava India Ecommerce app'
}

export default function AboutPage() {
  return (
    <div className=''>
      <ProductList />
    </div>
  )
}
