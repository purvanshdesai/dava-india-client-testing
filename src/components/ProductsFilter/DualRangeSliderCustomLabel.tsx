'use client'

import * as React from 'react'
import { useState } from 'react'
import { DualRangeSlider } from '../ui/DualRangeSlider'

const DualRangeSliderCustomLabel = ({ range }: any) => {
  const [values, setValues] = useState([0, 5000])
  React.useEffect(() => {
    const payload = {
      from: values[0],
      to: values[1]
    }
    range(payload)
  }, [values])
  return (
    <div className='w-full space-y-5 px-5'>
      <DualRangeSlider
        // label={value => <span className='font-semibold'>{value}</span>}
        
        value={values}
        onValueChange={setValues}
        min={0}
        max={5000}
        step={1}
        className='rounded-full border bg-[#EFEFEF]'
      />
    </div>
  )
}
export default DualRangeSliderCustomLabel
