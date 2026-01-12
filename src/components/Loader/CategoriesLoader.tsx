export default function CategoriesLoader() {
  return (
    <div>
      <div className='flex animate-pulse flex-col gap-6 rounded-md border bg-white p-6 dark:border-gray-600 dark:bg-gray-900'>
        <div className='h-8 w-52 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
        <div className='grid grid-cols-8 gap-8'>
          {[...Array(8)].map((_, index) => (
            <div key={index} className='flex flex-col gap-2'>
              <div className='h-24 w-24 rounded-full border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
              <div className='h-6 w-24 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
