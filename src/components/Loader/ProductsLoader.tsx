export default function ProductLoader() {
  return (
    <div className="mt-2 rounded-lg">
      <div className='flex animate-pulse flex-col gap-6 rounded-lg border bg-white p-6 dark:border-gray-600 dark:bg-gray-900'>
        <div className='h-8 w-52 rounded-lg border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
        <div className='grid grid-cols-5 gap-8'>
          {[...Array(10)].map((_, index) => (
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
