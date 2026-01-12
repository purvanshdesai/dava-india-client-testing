'use client'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Trash2Icon,
  CircleIcon,
  CircleCheckIcon,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import useDeliveryAddressStore from '@/store/useDeliveryAddressStore'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useEffect, useState } from 'react'
import { AddNewAddressDialog } from './AddNewAddressDialog'
import { deleteUserAddress } from '@/utils/actions/userAddressActions'
import { fetchLocationByZipCode } from '@/utils/actions/zipCodeActions'
import { useTranslations } from 'next-intl'
import AlertBox from '../AlertBox'
import Image from 'next/image'

interface Address {
  hideOptions?: boolean
  selected?: boolean
  address: any
}

export default function UserAddress() {
  const { fetchAddresses, addresses, defaultAddress, loading } =
    useDeliveryAddressStore(state => state)
  const cart = useTranslations('Cart')
  const {
    changeAddress: handleAddressChange,
    selectedAddress,
    setCurrentLocation
  } = useCheckoutStore(state => state)

  const [open, setOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState('')
  const [showOtherAddresses, setShowOtherAddresses] = useState(false)

  const handleSelectAddress = async (address: any) => {
    handleAddressChange(address)

    const location = await fetchLocationByZipCode(address?.postalCode)
    if (location) await setCurrentLocation(location)
  }
  const handleDeleteAddress = (address: string) => {
    try {
      setAddressToDelete(address)
      setOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const onContinue = async () => {
    try {
      await deleteUserAddress(addressToDelete)
      fetchAddresses()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const getOtherAddresses = () => {
    if (!addresses?.length) return []

    return addresses?.filter(a => a._id !== defaultAddress?._id)
  }

  const AddressCard = ({ hideOptions, address }: Address) => {
    return (
      <Card className='rounded-none dark:bg-gray-900'>
        <div className='grid grid-cols-[40px_1fr] p-2 md:p-4'>
          <div onClick={() => handleSelectAddress(address)}>
            {selectedAddress?._id == address?._id ? (
              <CircleCheckIcon
                size={20}
                className='cursor-pointer text-primary'
              />
            ) : (
              <CircleIcon
                size={18}
                className='cursor-pointer text-label dark:text-label-dark'
              />
            )}
          </div>
          <div className='space-y-2 text-sm'>
            <h1 className='text-sm font-semibold'>
              {address.userName}{' '}
              {address?.type && (
                <span className='ml-3 rounded-full bg-primary-green-dim px-2 py-1 text-xs font-normal'>
                  {address?.type}
                </span>
              )}
            </h1>
            <p className='text-sm text-label dark:text-label-dark'>
              {address.addressLine1}, {address.addressLine2},
            </p>
            <p className='text-sm text-label dark:text-label-dark'>
              {address.city}, {address.state}, {address.country}, Pin:{' '}
              {address.postalCode}
            </p>
            <p className='flex gap-2'>
              <span className='text-label dark:text-label-dark'>Phone:</span>
              <span className='font-medium'>{address.phoneNumber}</span>
            </p>

            {!hideOptions && (
              <div className='flex gap-3 pt-3'>
                <AddNewAddressDialog
                  addressId={address._id}
                  address={address}
                  selectedAddress={selectedAddress}
                  loading={loading}
                  onSave={(updatedAddress: any) => {
                    handleSelectAddress(updatedAddress)
                  }}
                />

                <Button
                  variant={'outline'}
                  size={'sm'}
                  onClick={() => handleDeleteAddress(address._id)}
                  className='flex gap-2'
                >
                  <Trash2Icon size={16} />
                  {cart('remove')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className=''>
      {defaultAddress && (
        <div className=''>
          <p className='rounded-t-md bg-[#F9F9F9] p-4 text-sm font-medium'>
            {cart('default_address')}
          </p>
          {AddressCard({ address: defaultAddress })}
        </div>
      )}

      {getOtherAddresses() && getOtherAddresses()?.length > 0 && (
        <div className='rounded-b-md border'>
          <p className='flex items-center justify-between bg-white p-4 text-sm font-medium'>
            {/*{cart('other_addresses')}*/}
            Previously Saved Address
            <div
              className='cursor-pointer'
              onClick={() => setShowOtherAddresses(prev => !prev)}
            >
              {showOtherAddresses ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
          </p>
          <div
            className={`overflow-y-scroll transition-all duration-300 ease-in-out ${
              showOtherAddresses
                ? 'max-h-[600px] opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className=''>
              {getOtherAddresses()
                .filter(a => !a.isDefault)
                .map((address, idx) => {
                  return (
                    <div key={idx}>
                      {AddressCard({ hideOptions: false, address: address })}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
      <div className='flex flex-col gap-3'>
        {!addresses.length && (
          <Card>
            <CardHeader className='flex flex-row items-center gap-3'>
              <div
                style={{ position: 'relative', width: '80px', height: '80px' }}
              >
                <Image
                  src={`/images/NoAddress.svg`}
                  alt='no-Address'
                  fill
                  priority={false}
                />
              </div>
              <div className='text-sm'>
                <span className='text-red-500'>No Address Available! </span>
                Please add new address by click on 'Add New Address' to continue
                your purchase.
              </div>
            </CardHeader>
          </Card>
        )}
        <Card className='cursor-pointer dark:bg-gray-900'>
          <CardHeader className='py-3'>
            <AddNewAddressDialog addressId={undefined} loading={false} />
          </CardHeader>
        </Card>
      </div>

      <AlertBox
        openState={[open, setOpen]}
        content={'Are you sure you want to delete this address?'}
        onContinue={onContinue}
      />
    </div>
  )
}
