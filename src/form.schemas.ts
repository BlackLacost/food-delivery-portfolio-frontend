import * as yup from 'yup'

export const createRestaurantSchema = yup.object({
  name: yup.string().min(5).required(),
  address: yup.string().min(5).required(),
  categoryName: yup.string().min(5).required(),
  image: yup
    .mixed()
    .test({
      message: 'Image Required',
      test: (files: FileList) => files.length > 0,
    })
    .test({
      message: 'Only one Image',
      test: (files: FileList) => files.length === 1,
    })
    .test({
      message: 'Max size is 5 Mb',
      test: (files: FileList) => {
        return files.length > 0 && files[0].size <= 5 * 1024 * 1024
      },
    }),
})

export type CreateRestaurantForm = {
  name: string
  address: string
  categoryName: string
  image: FileList
}
