'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit3Icon, PlusIcon } from 'lucide-react'
import FormDialog from '../Form/FormDialog'

import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { addressFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import {
  createUserAddress,
  patchUserAddress
} from '@/utils/actions/userAddressActions'
import { useSession } from 'next-auth/react'
import { useFetchLocationByZipCode } from '@/utils/hooks/zipCodeHooks'
import useDeliveryAddressStore from '@/store/useDeliveryAddressStore'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { autoCompleteMapSearch, getGMapPlaceDetails } from '@/lib/google'
import { useDebouncedValue } from '@/hooks/useDebounce'
import { useToast } from '@/hooks/use-toast'

const LazyMap = dynamic(
  () => import('@/components/Map/Map').then(mod => mod.default),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>
  }
)

export function AddNewAddressDialog({
  addressId,
  loading,
  address,
  onSave,
  selectedAddress
}: any) {
  // states
  const { toast } = useToast()

  const fetchAddresses = useDeliveryAddressStore(state => state.fetchAddresses)
  const [addressType, setAddressType]: any = useState<'Home' | 'Office' | ''>(
    ''
  )
  const [pinCode, setPinCode] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mapShow, setMapShow] = useState(true)

  const {
    addresses,
    defaultAddress,
    loading: isAddressFetching
  } = useDeliveryAddressStore(state => state)

  const { data: newLocation, isLoading } = useFetchLocationByZipCode(
    pinCode,
    pinCode?.length == 6
  )

  useEffect(() => {
    if (addressId && address?.coordinates && address?.fullAddress)
      setMapShow(false)
  }, [addressId, address])

  useEffect(() => {
    if (
      !isAddressFetching &&
      address &&
      selectedAddress &&
      address._id == selectedAddress._id &&
      !address.coordinates
    ) {
      setDialogOpen(true)
    }
  }, [address, selectedAddress])

  // useEffect(() => {
  //   setMapShow(true)
  // }, [!dialogOpen])

  useEffect(() => {
    if (addresses.length === 0) {
      setDialogOpen(true)
    }
  }, [!addresses.length, defaultAddress == null])

  const cart = useTranslations('Cart')
  const mobPro = useTranslations('MobileProfile')

  // form
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      userName: address?.userName ?? '',
      phoneNumber: address?.phoneNumber ?? '',
      alternatePhoneNumber: address?.alternatePhoneNumber ?? '',
      addressLine1: address?.addressLine1 ?? '',
      addressLine2: address?.addressLine2 ?? '',
      postalCode: address?.postalCode ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      isDefault: address?.isDefault ?? false,
      type: address?.type ?? '',
      coordinates: {
        longitude: address?.coordinates?.longitude ?? 77.043908,
        latitude: address?.coordinates?.latitude ?? 13.805108
      },
      fullAddress: address?.fullAddress ?? ''
    }
  })

  useEffect(() => {
    if (address?.type) {
      handleTypeSelection(address?.type)
    }
  }, [address, form])

  useEffect(() => {
    if (newLocation || !isLoading) {
      if (!form.getValues('postalCode')) {
        form.setValue('postalCode', newLocation?.location?.zipCode)
      }

      // form.setValue('addressLine2', newLocation?.location?.area)
      form.setValue('city', newLocation?.location?.district)
      form.setValue('state', newLocation?.location?.state)
    }
  }, [newLocation, isLoading, form, loading])

  // Reset map state when dialog opens for new address
  useEffect(() => {
    if (dialogOpen && !addressId) {
      setMapShow(true)
      setAddressType('')
      setPinCode('')
    }
  }, [dialogOpen, addressId])
  // session to get user id
  const session = useSession() as any

  // function to set address type
  const handleTypeSelection = (type: 'home' | 'office') => {
    setAddressType(type)
    form.setValue('type', type)
  }

  // on submit to save data
  const onSubmit = async (data: z.infer<typeof addressFormSchema>) => {
    try {
      let result
      if (addressId) {
        result = await patchUserAddress(addressId, data)
      } else {
        result = await createUserAddress({
          ...data,
          country: 'india',
          userId: session?.data?.user?.id
        })
      }

      if (result?.invalidZipCode) {
        toast({
          title: 'Invalid postal code provided!',
          description: result?.message
        })

        return
      }

      await fetchAddresses()
      form.reset({
        userName: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
        city: '',
        state: '',
        isDefault: false,
        type: '',
        coordinates: {
          longitude: 77.043908,
          latitude: 13.805108
        },
        fullAddress: ''
      })

      setAddressType('')
      setPinCode('')
      setMapShow(true)
      setDialogOpen(false)

      setTimeout(() => {
        if (onSave && typeof onSave === 'function') onSave(result)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const AddressAutocomplete = ({ onPlaceSelected }: any) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [places, setPlaces] = useState<Array<any>>([])
    const [isLoading, setLoading] = useState(false)

    const { debouncedValue: debouncedSearchText, isDebouncing } =
      useDebouncedValue(searchQuery, 500)

    const handleSelectPlace = async (place: any) => {
      const details: any = await getGMapPlaceDetails(place?.place_id)

      if (!details) return

      onPlaceSelected({
        ...details,
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng
      })
      setSearchQuery('')
      setPlaces([])
    }

    const fetchPlaces = async () => {
      setLoading(true)
      const results = await autoCompleteMapSearch(debouncedSearchText)

      setPlaces(results ?? [])
      setLoading(false)
    }

    useEffect(() => {
      if (debouncedSearchText?.length > 3) fetchPlaces()
    }, [debouncedSearchText])

    return (
      <div className='relative flex flex-col space-y-5'>
        <div>
          <Input
            placeholder='Enter your address'
            value={searchQuery}
            onChange={(e: {
              target: { value: React.SetStateAction<string> }
            }) => {
              setSearchQuery(e.target.value)
            }}
            className='w-full rounded border border-gray-300 p-2'
            name={'address'}
          />

          {searchQuery && (
            <Card className='absolute top-full z-10 mt-1 w-full border'>
              <CardContent className='p-2'>
                {places.length > 0 ? (
                  places.map(place => {
                    // Use regex to wrap matched text in <strong>
                    const regex = new RegExp(`(${searchQuery})`, 'gi')
                    const highlightedDescription = place.description.replace(
                      regex,
                      '<strong>$1</strong>'
                    )

                    return (
                      <div
                        key={place.place_id}
                        onClick={() => handleSelectPlace(place)}
                        className='flex cursor-pointer items-center gap-1 rounded-md p-1.5 text-sm hover:bg-gray-100'
                      >
                        <MapPin className='text-red-600' size={18} />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightedDescription
                          }}
                        />
                      </div>
                    )
                  })
                ) : (
                  <p className='p-2 text-sm font-semibold text-gray-500'>
                    {isDebouncing || isLoading
                      ? 'Loading...'
                      : 'No results found'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  const handlePlaceSelection = (place: any) => {
    const getComponent = (components: any[], type: string): string => {
      return components.find(comp => comp.types.includes(type))?.long_name || ''
    }

    const getMultipleComponents: any = (
      components: any[],
      types: string[]
    ): string[] => {
      return types
        .map(type => getComponent(components, type))
        .filter(name => !!name)
    }

    const components = place.address_components || []

    // Street address
    // const streetNumber = getComponent(components, 'street_number')
    // const route = getComponent(components, 'route')
    // const premise = getComponent(components, 'premise')
    // const addressLine1 = [premise, streetNumber, route]
    //   .filter(Boolean)
    //   .join(', ')
    // form.setValue('addressLine1', addressLine1)

    // Locality details - include up to 3 levels
    const localityParts = getMultipleComponents(components, [
      'sublocality',
      'sublocality_level_1',
      'sublocality_level_2',
      'sublocality_level_3',
      'neighborhood',
      'locality'
    ])

    const addressLine2 = localityParts.slice(0, 3).join(', ') // Max 3 parts
    form.setValue('addressLine2', addressLine2)

    // Coordinates
    form.setValue('coordinates', {
      longitude: place.lng,
      latitude: place.lat
    })

    // Full address
    form.setValue('fullAddress', `${place.name}, ${place.formatted_address}`)

    // Postal code
    if (place.postalCode) {
      form.setValue('postalCode', place.postalCode)
      setPinCode(place.postalCode)
    }
  }

  // dialog inner content
  const formContent = (
    <>
      {!loading && !isLoading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => {
              onSubmit(data)
            })}
          >
            {mapShow ? (
              <div>
                <div className='col-span-2 w-full space-y-3'>
                  <AddressAutocomplete
                    onPlaceSelected={(place: any) => {
                      handlePlaceSelection(place)
                    }}
                  />

                  <FormField
                    control={form.control}
                    name={'coordinates'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select coordinates</FormLabel>
                        <div className='text-xs text-red-600'>
                          {form.formState.errors?.coordinates && (
                            <div>Longitude and latitude is required! </div>
                          )}
                        </div>

                        <FormControl>
                          {field.value && (
                            <LazyMap
                              addressId={addressId}
                              coordinates={{
                                lng: form.watch('coordinates.longitude'),
                                lat: form.watch('coordinates.latitude')
                              }}
                              onPlaceSelected={(value: any) =>
                                field.onChange({
                                  longitude: value.lng,
                                  latitude: value.lat
                                })
                              }
                            />
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-4'>
                <div
                  className='cursor-pointer rounded-md bg-green-700 p-3 text-white'
                  onClick={() => setMapShow(true)}
                >
                  <p className='text-sm font-bold'>Selected Address</p>

                  <div className='pt-1 text-sm'>
                    {form.watch('fullAddress')}
                  </div>
                </div>
                <Input
                  {...form.register('userName')}
                  placeholder='Enter your name*'
                  style={{ backgroundColor: '#F9F9F9' }}
                />
                {form?.formState?.errors?.userName && (
                  <p className='text-xs text-red-600'>
                    {form?.formState?.errors?.userName?.message}
                  </p>
                )}
                <Input
                  {...form.register('phoneNumber')}
                  placeholder='Mobile Number*'
                  style={{ backgroundColor: '#F9F9F9' }}
                />
                {form?.formState?.errors?.phoneNumber && (
                  <p className='text-xs text-red-600'>
                    {form?.formState?.errors?.phoneNumber?.message}
                  </p>
                )}
                <Input
                  {...form.register('alternatePhoneNumber')}
                  placeholder='Alternate Mobile Number*'
                  style={{ backgroundColor: '#F9F9F9' }}
                />
                {form?.formState?.errors?.alternatePhoneNumber && (
                  <p className='text-xs text-red-600'>
                    {form?.formState?.errors?.alternatePhoneNumber?.message}
                  </p>
                )}
                <Input
                  {...form.register('postalCode')}
                  placeholder='Pin Code*'
                  style={{ backgroundColor: '#F9F9F9' }}
                  onChange={e => setPinCode(e.target.value)}
                />{' '}
                {form?.formState?.errors?.postalCode && (
                  <p className='text-xs text-red-600'>
                    {form?.formState?.errors?.postalCode?.message}
                  </p>
                )}
                <Input
                  {...form.register('addressLine1')}
                  placeholder='Address*'
                  style={{ backgroundColor: '#F9F9F9' }}
                />
                {form?.formState?.errors?.addressLine1 && (
                  <p className='text-xs text-red-600'>
                    {form?.formState?.errors?.addressLine1?.message}
                  </p>
                )}
                <Input
                  {...form.register('addressLine2')}
                  placeholder='Locality / Town*'
                  style={{ backgroundColor: '#F9F9F9' }}
                />
                {form?.formState?.errors?.addressLine2 && (
                  <p className='text-xs text-red-600'>
                    {form?.formState?.errors?.addressLine2?.message}
                  </p>
                )}
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    {' '}
                    <Input
                      readOnly
                      {...form.register('city')}
                      placeholder='City / District*'
                      style={{ backgroundColor: '#F9F9F9' }}
                    />
                    {form?.formState?.errors?.city && (
                      <p className='text-xs text-red-600'>
                        {form?.formState?.errors?.city?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      readOnly
                      {...form.register('state')}
                      placeholder='State*'
                      style={{ backgroundColor: '#F9F9F9' }}
                    />
                    {form?.formState?.errors?.state && (
                      <p className='text-xs text-red-600'>
                        {form?.formState?.errors?.state?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='col-span-3 flex flex-col gap-3'>
                  <Label className='text-xs font-semibold'>
                    {cart('save_address_as')}
                  </Label>
                  <div className='flex items-center gap-4'>
                    <Badge
                      className={`border-primary ${
                        addressType === 'home' ? 'bg-orange-100' : 'bg-white'
                      } cursor-pointer text-black hover:bg-orange-100`}
                      onClick={() => handleTypeSelection('home')}
                    >
                      {mobPro('home')}
                    </Badge>
                    <Badge
                      className={`border-primary ${
                        addressType === 'office' ? 'bg-orange-100' : 'bg-white'
                      } cursor-pointer text-black hover:bg-orange-100`}
                      onClick={() => handleTypeSelection('office')}
                    >
                      {cart('office')}
                    </Badge>
                  </div>
                  {form?.formState?.errors?.type && (
                    <p className='text-xs text-red-600'>
                      {form?.formState?.errors?.type?.message}
                    </p>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='isDefault'
                    {...form.register('isDefault')}
                    checked={form.watch('isDefault')}
                    onCheckedChange={(e: boolean) =>
                      form.setValue('isDefault', e)
                    }
                  />
                  <label
                    htmlFor='isDefault'
                    className='text-xs font-medium leading-none'
                  >
                    {cart('make_this_as_my_default_address')}
                  </label>
                </div>
                <Button type='submit' className='mt-4 w-full'>
                  {cart('save_address')}
                </Button>
              </div>
            )}
            {mapShow && (
              <Button
                className='ml-auto mt-5 flex'
                onClick={() => {
                  setMapShow(false)
                }}
                disabled={!form.watch('fullAddress')}
              >
                Confirm and Continue
              </Button>
            )}
          </form>
        </Form>
      )}
    </>
  )

  // Trigger
  const trigger = addressId ? (
    <div>
      {' '}
      <Button variant={'outline'} size={'sm'} className='flex gap-2'>
        <Edit3Icon size={16} />
        {cart('edit_address')}
      </Button>
    </div>
  ) : (
    <div
      className='flex cursor-pointer items-center gap-3 text-sm font-semibold text-red-400'
      onClick={() => setDialogOpen(true)}
    >
      <PlusIcon />
      {cart('add_new_address')}
    </div>
  )

  return (
    <FormDialog
      trigger={trigger}
      title={addressId ? 'Edit Address' : 'Add New Address'}
      content={formContent}
      footerActions={null}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      classNames='max-w-[60%] max-h-[95%] overflow-y-scroll'
    />
  )
}
