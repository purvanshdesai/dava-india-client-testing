import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Combobox } from '@/components/ui/combobox'
import { UseFormReturn } from 'react-hook-form'

const FormComboboxField = ({
  formInstance: form,
  isSmall,
  name,
  label,
  isReq,
  placeholder,
  ...fields
}: {
  formInstance: UseFormReturn
  items: { value: string; label: string }[]
  className?: string
  multiple?: boolean
  isSmall?: boolean
  name: string
  label?: string
  isReq?: boolean
  placeholder?: string
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              className={cn(isSmall ? 'text-sm' : 'text-lg', 'text-black')}
            >
              {label}
              {label && isReq ? <span className='text-red-600'>*</span> : null}
            </FormLabel>
          )}
          <FormControl>
            <div>
              <Combobox
                {...fields}
                label={placeholder ? placeholder : ''}
                fieldValue={field.value}
                setFieldValue={value => form.setValue(name, value)}
              />
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormComboboxField
