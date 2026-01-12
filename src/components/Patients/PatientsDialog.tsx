'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import FormDialog from '../Form/FormDialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { patientsSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'

import FormRadioButton from '../Form/FormRadioButton'
import FormReactDatePicker from '../Form/FormReactDatePicker'
import FormSelectField from '../Form/FormSelectField'
import { DialogClose } from '../ui/dialog'
import {
  createUserPatient,
  patchUserPatient
} from '@/utils/actions/patientsActions'
import usePatientsStore from '@/store/userPatientsStore'

export function PatientsDialog({ patientId, loading, patientDetails }: any) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { fetchPatients } = usePatientsStore(state => state)
  // form
  const form = useForm<z.infer<typeof patientsSchema>>({
    resolver: zodResolver(patientsSchema),
    defaultValues: {
      name: patientDetails?.name ?? '',
      phoneNumber: patientDetails?.phoneNumber ?? '',
      email: patientDetails?.email ?? '',
      relation: patientDetails?.relation ?? '',
      dateOfBirth: patientId ? new Date(patientDetails?.dateOfBirth) : null,
      gender: patientDetails?.gender ?? 'male'
    }
  })

  // on submit to save data
  const onSubmit = async (data: z.infer<typeof patientsSchema>) => {
    setSubmitLoading(true)
    try {
      if (patientId) {
        await patchUserPatient(patientId, data)
      } else {
        await createUserPatient({ ...data })
      }
      setDialogOpen(false)
      fetchPatients()
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitLoading(true)
    }
  }

  // dialog inner content
  const formContent = (
    <>
      {!loading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => {
              onSubmit(data)
            })}
          >
            <div className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Your Name'
                        className='border-gray-200 bg-gray-100'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          className='w-full border-gray-200 bg-gray-100 pl-12'
                          placeholder='Enter phone number'
                          value={field.value}
                          onChange={e => {
                            if (/^\d*$/.test(e.target.value)) {
                              field.onChange(e.target.value)
                            }
                          }}
                        />
                        <div className='absolute left-2 top-2 border-r-2 border-[#B2B2C2] pr-2'>
                          +91
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormReactDatePicker
                formInstance={form as unknown as UseFormReturn}
                name='dateOfBirth'
                placeholder='Date of birth'
                isSmall={true}
                width={'max-w-[100%]'}
                label='Date of birth'
              />

              <FormRadioButton
                formInstance={form as unknown as UseFormReturn}
                name={'gender'}
                label={'Gender'}
                isSmall={true}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
              />

              <FormSelectField
                formInstance={form as unknown as UseFormReturn}
                isSmall={true}
                isReq={true}
                label={'Select Relation'}
                name={'relation'}
                placeholder={'Select Relation'}
                items={(
                  [
                    { label: 'Brother', value: 'Brother' },
                    { label: 'Cousin', value: 'Cousin' },
                    { label: 'Daughter', value: 'Daughter' },
                    { label: 'Father', value: 'Father' },
                    { label: 'Grand Daughter', value: 'Grand Daughter' },
                    { label: 'Grand Father', value: 'Grand Father' },
                    { label: 'Grand Mother', value: 'Grand Mother' },
                    { label: 'Grand Son', value: 'Grand Son' },
                    { label: 'Husband', value: 'Husband' },
                    { label: 'Wife', value: 'Wife' },
                    { label: 'Me', value: 'Me' },
                    { label: 'Mother', value: 'Mother' },
                    { label: 'Sister', value: 'Sister' },
                    { label: 'Son', value: 'Son' }
                  ] as any
                )?.map((c: any) => ({ label: c.label, value: c.value }))}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Email'
                        className='border-gray-200 bg-gray-100'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center gap-4'>
                <DialogClose className='w-full'>
                  <Button variant={'secondary'} className='mt-4 w-full'>
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type='submit'
                  disabled={submitLoading}
                  className='mt-4 w-full'
                  loader={submitLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  )

  // Trigger
  const trigger = patientId ? (
    <div>
      <Pencil size={16} className='cursor-pointer' />
    </div>
  ) : (
    <div
      className='flex cursor-pointer items-center justify-end gap-3 text-sm font-semibold text-red-400'
      onClick={e => {
        e.preventDefault()
        setDialogOpen(true)
      }}
    >
      <div className='flex items-center justify-end'>
      <Button type='button' className='rounded-full px-4 py-2 text-white'>
        Add Patient
      </Button>
      </div>
    </div>
  )

  return (
    <FormDialog
      trigger={trigger}
      title={patientId ? 'Edit Patient' : 'Add New Patient'}
      content={formContent}
      footerActions={null}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      classNames='max-w-[40%]'
    />
  )
}
