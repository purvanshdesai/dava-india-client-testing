import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { MapPin } from 'lucide-react'
import PinCodePopover from './PinCodePopover'
import useCheckoutStore from '@/store/useCheckoutStore'
import Image from 'next/image'

export default function PinCodeManager() {
  const { currentLocation } = useCheckoutStore(state => state)

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className='w-70 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm dark:bg-gray-700'>
            <div
              className='rounded-full bg-gradient-to-b p-1.5'
              style={{
                background: 'linear-gradient(to bottom, #2DA771,#2A8D61)'
              }}
            >
              <MapPin size={18} className='text-white' />
            </div>
            <span className='font-bold text-primary'>
              {currentLocation?.zipCode}
            </span>
            <span className='truncate'>{currentLocation?.area}</span>
            <div className='relative ml-1 h-4 w-4'>
              <Image
                src={'/images/drowdown-arrow.svg'}
                alt='Dropdown Arrow'
                fill
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='-p-2 relative z-[100] ml-6 w-80 md:w-96'>
          <PinCodePopover />
        </PopoverContent>
      </Popover>
    </div>
  )
}
