import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function GenericAbout({ layout }: { layout: any }) {
  const generic = useTranslations('HomePageGenericAbout')
  const content = [
    {
      label: 'Reliable',
      description:
        'Made with high-quality standards, our generics provide reliable, consistent results you can trust.',
      image: '/images/Reliable.svg',
      i18nKey: 'reliable',
      i18nDescKey: 'reliable_desc'
    },
    {
      label: 'Secure',
      description:
        'Each medicine meets strict safety standards, ensuring trusted care with every dose.',
      image: '/images/Secure.svg',
      i18nKey: 'secure',
      i18nDescKey: 'secure_desc'
    },
    {
      label: 'Affordable',
      description:
        'Quality treatments without the high price, making better health accessible for all.',
      image: '/images/Affordable.svg',
      i18nKey: 'affordable',
      i18nDescKey: 'affordable_desc'
    },
    {
      label: 'Effective',
      description:
        'Clinically proven to deliver the same benefits as branded alternatives, without compromise.',
      image: '/images/Effective.svg',
      i18nKey: 'effective',
      i18nDescKey: 'effective_desc'
    }
  ]
  return (
    <div className='flex w-full rounded-xl bg-gradient-to-r from-white via-white to-[#C8EFFE] p-4 dark:bg-gray-900 md:p-6'>
      <div className='flex flex-col gap-6 md:flex-row md:gap-8'>
        <div>
          <iframe
            className='h-[180px] w-[350px] md:h-[282px] md:w-[474px]'
            src={layout?.properties?.videoUrl}
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        </div>
        <div className='flex flex-col gap-6'>
          <div className='mt-4 flex flex-row items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img src='/images/Home/megaphone.gif' alt='megaphone' />
              <p className='text-lg font-semibold'>
                {generic('generic_medicines_are_smarter_choice')}
              </p>
            </div>
            <Link href={'/genericInfo'}>
              <div className='flex cursor-pointer items-center justify-end'>
                <span className='mr-1 text-base font-semibold text-primary'>
                  {generic('know_more_button')}
                </span>
                <div
                  style={{
                    position: 'relative',
                    width: '24px',
                    height: '24px'
                  }}
                >
                  <Image
                    src='/images/KnowMoreButton.svg'
                    alt='Footer Logo'
                    fill
                    priority={true}
                  />
                </div>
              </div>
            </Link>
          </div>

          <div className='grid grid-cols-4 gap-3'>
            {content.map((item, idx) => (
              <div className='flex flex-col gap-3' key={idx}>
                <span className='mb-2 flex items-center gap-2 text-sm font-semibold'>
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      marginBottom: 2
                    }}
                  >
                    <Image
                      src={item.image}
                      alt='Footer Logo'
                      fill
                      priority={false}
                    />
                  </div>

                  {generic(item.i18nKey)}
                </span>
                <span className='text-sm'>{generic(item.i18nDescKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
