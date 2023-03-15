import * as yup from 'yup'
import { UserRole } from './gql/graphql'

export const editProfileSchema = yup.object({
  email: yup.string().email().nullable(),
  password: yup.string().min(3).nullable(),
})
export type EditProfileForm = yup.InferType<typeof editProfileSchema>

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Почта должна быть указана правильно')
    .required('Почта обязательна'),
  password: yup
    .string()
    .min(3, 'Пароль должен быть минимум из 3 символов')
    .required('Пароль обязателен'),
})
export type LoginForm = yup.InferType<typeof loginSchema>

export const createAccountSchema = loginSchema.concat(
  yup.object({
    role: yup.mixed<UserRole>().oneOf(Object.values(UserRole)).required(),
  })
)
export type CreateAccountForm = yup.InferType<typeof createAccountSchema>

export const searchTermSchema = yup.object({
  searchTerm: yup.string().min(3).required(),
})
export type SearchTermForm = yup.InferType<typeof searchTermSchema>

export const createRestaurantSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Название должно быть как минимум из 3 символов')
    .required(),
  categoryName: yup.string().min(3).required(),
  image: yup
    .mixed()
    .test({
      message: 'Картинка обязательна',
      test: (files: FileList) => files?.length > 0,
    })
    .test({
      message: 'Добавьте только одну картинку',
      test: (files: FileList) => files?.length === 1,
    })
    .test({
      message: 'Размер картинки не больше 5MB',
      test: (files: FileList) => {
        return files?.length > 0 && files[0].size <= 5 * 1024 * 1024
      },
    }),
})
export type CreateRestaurantForm = {
  name: string
  categoryName: string
  image: FileList
}

export const addDishSchema = yup.object({
  name: yup
    .string()
    .min(5, 'Название должно быть минимум 5 символов')
    .required(),
  description: yup
    .string()
    .min(5, 'Описание должно быть минимум 5 символов')
    .max(500, 'Описание должно быть максимум 500 символов')
    .required(),
  price: yup.number().positive('Цена должна быть > 0').required(),
  image: yup
    .mixed()
    .test({
      message: 'Картинка товара обязательна',
      test: (files: FileList) => files?.length > 0,
    })
    .test({
      message: 'Выберете только одну картинку',
      test: (files: FileList) => files?.length === 1,
    })
    .test({
      message: 'Максимальный размер картинки 2 Mb',
      test: (files: FileList) => {
        return files?.length > 0 && files[0].size <= 2 * 1024 * 1024
      },
    }),
  options: yup
    .array()
    .of(
      yup.object({
        name: yup.string().min(5).required(),
        extra: yup.number().positive().integer().optional(),
      })
    )
    .nullable(),
})
export type AddDishForm = {
  name: string
  description: string
  price: number
  image: FileList
  options?: {
    name: string
    extra?: number
  }[]
}
