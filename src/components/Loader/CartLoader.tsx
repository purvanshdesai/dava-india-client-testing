export default function CartLoader() {
  return (
    <div>
      <div className='flex animate-pulse flex-col gap-6 rounded-md border p-6 dark:border-gray-600 dark:bg-gray-900'>
        <div
          className='grid gap-8'
          style={{ gridTemplateColumns: '1fr 400px' }}
        >
          <div className='flex flex-col gap-8'>
            <div className='h-48 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            <div className='h-48 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            <div className='h-8 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
          </div>
          <div className='flex flex-col gap-8'>
            <div className='h-48 rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
            <div className='h-[400px] rounded-md border bg-gray-200 dark:border-gray-600 dark:bg-gray-600'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
