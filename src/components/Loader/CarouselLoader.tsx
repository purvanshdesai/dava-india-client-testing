export default function CarouselLoader() {
  return (
    <div>
      <div className='flex animate-pulse flex-col gap-6 rounded-md border bg-white p-6 dark:border-gray-600 dark:bg-gray-900'>
        <div className='grid grid-cols-3 gap-8'>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className='h-64 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
