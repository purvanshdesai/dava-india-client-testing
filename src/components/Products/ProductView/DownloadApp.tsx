import Image from 'next/image'
import Link from 'next/link'

const DownloadAppSection = () => {
  return (
    <div className='relative py-2'>
      <div
        className='absolute left-0 top-0 h-full w-full rounded-lg'
        style={{
          backgroundImage: `url('/images/AppDownloadBg.png')`,
          backgroundColor: 'transparent',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />
      <div className='container mx-auto flex flex-col items-center justify-between lg:flex-row'>
        {/* Phone Image */}
        <div className='relative flex w-full justify-center lg:w-1/2'>
          <Image
            src='/images/InnerDownloadMobile.svg' // Replace with your image path
            alt='App Preview'
            width={500}
            height={800}
            className='object-contain'
          />
        </div>

        {/* Text and QR Code Section */}
        <div className='mt-10 flex w-full flex-col items-center text-center lg:mt-0 lg:w-1/2 lg:items-start lg:text-left'>
          <h2 className='relative mb-4 text-3xl font-bold'>Download Our App</h2>
          <p className='relative mb-6'>
            Scan the following QR code to download the app.
          </p>
          <div className='flex items-end gap-6'>
            <Image
              className='relative'
              src='/images/DavaindiaAppQRCode.png' // Replace with your QR code path
              alt='QR Code'
              width={170}
              height={170}
            />
            <div className='flex gap-4'>
              <Link
                href={
                  'https://apps.apple.com/in/app/davaindia-generic-pharmacy/id6741474883'
                }
                target='_blank'
                rel='noopener noreferrer'
              >
                <div
                  style={{
                    position: 'relative',
                    width: '180px',
                    height: '60px'
                  }}
                >
                  <Image
                    src={'/images/AppStoreButton.svg'}
                    alt='App store button'
                    className='cursor-pointer'
                    fill
                    priority={true}
                  />
                </div>
              </Link>
              <Link
                rel='noopener noreferrer'
                target='_blank'
                href={
                  'https://play.google.com/store/apps/details?id=com.davaindia'
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '180px',
                    height: '60px'
                  }}
                >
                  <Image
                    src={'/images/PlayStoreButton.svg'}
                    alt='Play store button'
                    className='cursor-pointer'
                    fill
                    priority={true}
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadAppSection
