export default function ProductInnerViewLoader() {
  return (
    <div>
      <div className='flex animate-pulse flex-col gap-6 rounded-md border p-6 dark:border-gray-600 dark:bg-gray-900'>
        <div className='grid gap-8' style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div
            className='grid gap-4'
            style={{ gridTemplateColumns: '150px 1fr' }}
          >
            <div className='flex flex-col gap-4'>
              <div className='h-40 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
              <div className='h-40 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
              <div className='h-40 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
              <div className='h-40 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            </div>

            <div className=''>
              <div className='h-full rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='h-12 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            <div className='h-24 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            <div className='h-60 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            <div className='h-60 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
          </div>
        </div>
        <div className='h-[500px] rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
      </div>
    </div>
  )
}
