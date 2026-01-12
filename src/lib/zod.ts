import { boolean, object, string, z, array, any, date, number } from 'zod'

export const signInSchema = object({
  email: string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(3, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters')
})

export const signInWithOtpSchema = object({
  contact: z
    .string()
    .min(1, { message: 'Please enter your email or phone number' })
    .refine(
      val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d{10}$/.test(val),
      {
        message: 'Must be a valid email or 10-digit phone number'
      }
    ),
  otp: string().min(5, { message: 'Otp must be 5 digits' })
})

export const passwordSchema = string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter'
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter'
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[\W_]/, {
    message: 'Password must contain at least one special character'
  })

export const signUpFormSchema = object({
  name: string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' }),

  phone: string().regex(/^\+?\d{10,15}$/, {
    message:
      'Phone number must be between 10 to 15 digits and can include a country code'
  }),
  email: string().email(),
  password: passwordSchema,
  verifyPassword: passwordSchema
}).refine(data => data.password === data.verifyPassword, {
  message: 'Password does not match',
  path: ['verifyPassword']
})

export const otpFormSchema = object({
  otp: string().min(5, { message: 'Enter valid otp' })
})

export const userSchema = object({
  name: string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' }),

  phone: string().regex(/^\+?\d{10,15}$/, {
    message:
      'Phone number must be between 10 to 15 digits and can include a country code'
  }),
  email: string().email(),
  dateOfBirth: date().nullable().optional(),
  gender: string().optional(),
  height: string().optional(),
  weight: string().optional()
})
export const addressFormSchema = object({
  userName: string().min(3, { message: 'Please enter valid name' }),
  phoneNumber: string()
    .regex(/^\d{10}$/, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    })
    .min(10, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    })
    .max(10, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    }),
  addressLine1: string().min(3, { message: 'Please enter valid address' }),
  addressLine2: string().min(3, { message: 'Please enter valid address' }),
  postalCode: string().min(6, { message: 'please enter a valid pincode' }),
  city: string(),
  state: string(),
  isDefault: boolean(),
  type: string(),
  coordinates: object({
    latitude: number(),
    longitude: number()
  }),
  fullAddress: string().nullable(),
  alternatePhoneNumber: string()
    .regex(/^\d{10}$/, {
      message:
        'Alternate Phone number must contain exactly 10 digits and only numbers'
    })
    .min(10, { message: 'Please enter your alternate phone number' })
    .max(10, { message: 'Please enter your alternate phone number' })
})
export const forgotPasswordSchema = object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email' })
    .min(1, { message: 'Email is required' })
})

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(5, { message: 'Password should be at least 5 characters' }),
  confirmPassword: z
    .string()
    .min(5, { message: 'Password should be at least 5 characters' })
})

export const contactFormSchema = object({
  name: string().min(3, { message: 'Please enter your name' }),
  phoneNumber: string()
    .regex(/^\d{10}$/, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    })
    .min(10, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    })
    .max(10, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    }),
  email: string({ message: 'Please enter your email' })
    .email({ message: 'Invalid email' })
    .min(1, { message: 'Email is required' }),
  message: string().min(10, {
    message: 'Query should be at least 10 characters'
  })
})

export const returnProductSchema = object({
  reason: string().min(3, { message: 'Please select your reason' }),
  note: string(),
  images: array(any()).min(1, { message: 'Please attach a product pictures' })
})

export const getReturnProductSchema = (maxQuantity: number) =>
  z.object({
    reason: string().min(3, { message: 'Please select your reason' }),
    note: string(),
    returnQuantity: z.coerce
      .number()
      .min(1, 'Quantity must be at least 1')
      .max(maxQuantity, `Quantity cannot exceed ${maxQuantity}`)
      .optional(),
    images: array(any()).min(1, { message: 'Please attach a product pictures' })
  })

export const cancelProductSchema = object({
  reason: string().min(3, { message: 'Please select your reason' }),
  note: string(),
  cancelQuantity: any().optional()
})

// helper to build schema dynamically based on available quantity
export const getCancelProductSchema = (maxQuantity: number) =>
  z.object({
    reason: string().min(3, { message: 'Please select your reason' }),
    note: string(),
    cancelQuantity: z.coerce
      .number()
      .min(1, 'Quantity must be at least 1')
      .max(maxQuantity, `Quantity cannot exceed ${maxQuantity}`)
      .optional()
  })

export const consultDoctor = object({
  comment: string().min(3, { message: 'Please enter your note' })
})

export const patientsSchema = object({
  name: string().min(3, { message: 'Name is required' }),
  phoneNumber: string()
    .regex(/^\d{10}$/, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    })
    .min(10, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    })
    .max(10, {
      message: 'Phone number must contain exactly 10 digits and only numbers'
    }),
  email: string().email().min(3, { message: 'Email is required' }),
  dateOfBirth: date().nullable().optional(),
  gender: string().optional(),
  relation: string().optional()
})

export const newRegisterSchema = object({
  name: string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' }),

  phoneNumber: string().regex(/^\+?\d{10}$/, {
    message: 'Phone number must be 10 digits'
  }),
  email: string().email(),
  dateOfBirth: date().nullable().optional(),
  gender: string().optional()
})
