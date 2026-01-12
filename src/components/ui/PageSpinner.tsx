import React from 'react'
import { Spinner } from './Spinner'

export default ({ show }: { show: boolean }) => {
  return (
    <div
      style={{
        display: show ? 'block' : 'none',
        backgroundColor: 'rgb(0 0 0 / .4)'
      }}
      className='fixed -top-4 left-0 h-[100vh] w-[100vw]'
    >
      <div className='flex h-full w-full items-center justify-center'>
        <Spinner size={'large'} />
      </div>
    </div>
  )
}
