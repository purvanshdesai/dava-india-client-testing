import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { fetchCollectionNavigationPath } from '@/utils/actions/navigationActions'

export default function FullBanner({ layout }: { layout: any; key: string }) {
  const router = useRouter()
  const [banner, setBanner] = useState<any>(null)
  const [properties, setProperties] = useState<any>(null)

  useEffect(() => {
    if (layout?.banner) {
      setBanner(layout?.banner?.device?.desktop)
      setProperties(layout?.banner?.properties)
    }
  }, [layout])

  const handleClickBanner = async () => {
    try {
      const { redirectType, redirectUrl, collection } = properties

      if (redirectType === 'none') return

      if (redirectType === 'externalLink') {
        window.open(redirectUrl, '_blank')
      } else if (redirectType === 'collection') {
        // Fetch collection info navigation
        const path = await fetchCollectionNavigationPath(collection)
        router.push(`/categories/${path.join('/')}`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (!banner) return <></>

  return (
    <div>
      <div
        className={properties?.redirectType === 'none' ? '' : 'cursor-pointer'}
        onClick={() => handleClickBanner()}
      >
        <div className='max-h-[320px]'>
          <Image
            key={banner?.imageUrl}
            src={`${banner?.imageUrl}`}
            alt={layout?.title}
            width={1680} // Set width of the original image
            height={320} // Set height of the original image
            layout='responsive' // Makes the image responsive
            priority // Ensures the image loads immediately for better UX
            className='overflow-hidden rounded-xl'
          />
        </div>
      </div>
    </div>
  )
}
