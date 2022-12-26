import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { FormError } from '../../components/FormError'
import { AddDishForm, addDishSchema } from '../../form.schemas'
import { graphql } from '../../gql'
import { uploadImage } from '../utils/upload-image'
import { MyRestaurantRoute_Query } from './MyRestaurantPage'

const AddDishRoute_Mutation = graphql(`
  mutation AddDish_Mutation($input: CreateDishInput!) {
    createDish(input: $input) {
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

export const AddDishPage = () => {
  const params = useParams<{ id: string }>()
  const [uploading, setUploading] = useState(false)
  const restaurantId = Number(params.id)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
    watch,
  } = useForm<AddDishForm>({
    mode: 'onChange',
    resolver: yupResolver(addDishSchema),
  })
  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'options',
  })

  const [addDish, { loading }] = useMutation(AddDishRoute_Mutation, {
    onCompleted: ({ createDish: { error } }) => {
      if (!error) {
        navigate(-1)
      }
    },
    refetchQueries: [
      {
        query: MyRestaurantRoute_Query,
        variables: { input: { id: restaurantId } },
      },
    ],
  })

  const onSubmit: SubmitHandler<AddDishForm> = async ({
    name,
    description,
    price,
    options,
    image,
  }) => {
    // console.log(rest)
    try {
      setUploading(true)
      const photo = await uploadImage(image[0])
      setUploading(false)

      addDish({
        variables: {
          input: { name, description, price, restaurantId, options, photo },
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onAddOptionClick = () => prepend({ name: '' })

  return (
    <div className="container flex flex-col items-center">
      <Helmet>
        <title>Add Dish | Доставка Еды</title>
      </Helmet>
      <h1 className="mt-28 mb-8 text-2xl">Add Dish</h1>
      <form
        className="my-5 mx-auto grid w-full max-w-screen-sm gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input className="input" {...register('name')} placeholder="Name" />
        <input
          className="input"
          {...register('description')}
          placeholder="Description"
        />
        <input
          className="hidden"
          {...register('image')}
          accept="image/*"
          type="file"
          id="coverImage"
        />
        <label
          htmlFor="coverImage"
          className="input cursor-pointer text-gray-400"
        >
          {watch('image') && watch('image').length > 0
            ? watch('image')[0].name
            : 'Выберете картинку товара...'}
        </label>
        {errors.image?.message && (
          <FormError>{errors.image.message.toString()}</FormError>
        )}
        <input
          className="input"
          {...register('price')}
          type="number"
          min={0}
          placeholder="Price"
        />
        <div className="my-10">
          <p className="mb-5 text-lg">Dish Options</p>
          <button
            className="mb-5 bg-gray-900 py-2 px-4 font-semibold text-white"
            onClick={onAddOptionClick}
            type="button"
          >
            Add Option
          </button>
          <div className="grid gap-3">
            {fields.map((field, index) => (
              <section className="flex space-x-3" key={field.id}>
                <input
                  className="flex-1 border-2 px-4 py-2 focus:border-gray-600 focus:outline-none"
                  {...register(`options.${index}.name`)}
                  placeholder="Name"
                />
                <input
                  className="border-2 px-4 py-2 focus:border-gray-600 focus:outline-none"
                  {...register(`options.${index}.extra`)}
                  type="number"
                  min={0}
                  placeholder="Extra"
                />
                <button
                  className="bg-red-500 py-1 px-4 font-semibold text-white"
                  onClick={() => remove(index)}
                  type="button"
                >
                  Remove Option
                </button>
              </section>
            ))}
          </div>
        </div>
        <Button canClick={isValid} loading={loading}>
          Add Dish
        </Button>
      </form>
    </div>
  )
}
