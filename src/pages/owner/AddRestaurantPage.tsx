import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { FormError } from '../../components/FormError'
import { H1 } from '../../components/H1'
import { Input } from '../../components/Input'
import { GetAddress, Position } from '../../features/yandex-map/GetAddress'
import {
  CreateRestaurantForm,
  createRestaurantSchema,
} from '../../form.schemas'
import { graphql } from '../../gql'
import { MyRestaurantsDocument } from '../../gql/graphql'
import { notify } from '../../toast'
import { uploadImage } from '../utils/upload-image'

const CreateRestaurant = graphql(`
  mutation CreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      restaurant {
        id
      }
    }
  }
`)

const GetCategories_Query = graphql(`
  query GetCategories_Query {
    allCategories {
      categories {
        id
        name
      }
    }
  }
`)

export const AddRestaurantPage = () => {
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const { data: categoriesData, loading } = useQuery(GetCategories_Query)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateRestaurantForm>({
    // mode: 'onChange',
    resolver: yupResolver(createRestaurantSchema),
  })

  const [createRestaurant] = useMutation(CreateRestaurant, {
    onCompleted: ({ createRestaurant: { restaurant } }) => {
      if (restaurant) {
        setUploading(false)
        return navigate('/')
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2))
      // TODO: create BadInputError on backend
      // error.graphQLErrors.forEach((graphqlError) =>
      //   // @ts-ignore
      //   graphqlError.extensions.response.message.forEach((error) => {
      //     notify.error(error)
      //   })
      // )
    },
    // TODO: update cache 20.06 Cache Optimization part Two
    refetchQueries: [{ query: MyRestaurantsDocument }],
  })

  const [restaurantPosition, setRestaurantPosition] = React.useState<Position>(
    {}
  )

  if (loading || !categoriesData?.allCategories.categories) return null

  const categories = categoriesData.allCategories.categories ?? []

  const onSubmit: SubmitHandler<CreateRestaurantForm> = async ({
    name,
    categoryName,
    image,
  }) => {
    try {
      setUploading(true)
      const coverImage = await uploadImage(image[0])
      setUploading(false)

      if (!restaurantPosition.address || !restaurantPosition.coords) {
        return notify.error('Адрес рестарана обязателен')
      }
      createRestaurant({
        variables: {
          input: {
            name,
            categoryName,
            address: restaurantPosition.address,
            latitude: restaurantPosition.coords[0],
            longitude: restaurantPosition.coords[1],
            coverImage,
          },
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-sm flex-col space-y-4">
      <Helmet>
        <title>Добавить ресторан | Доставка Еды</title>
      </Helmet>
      <div className="px-4 md:px-0">
        <H1>Добавить ресторан</H1>
        <form className="grid gap-3 pb-10" onSubmit={handleSubmit(onSubmit)}>
          <GetAddress
            position={restaurantPosition}
            setPosition={setRestaurantPosition}
          />
          <Input
            registerProps={register('name')}
            error={errors.name}
            placeholder="Название"
          />
          <select className="input" {...register('categoryName')}>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            className="hidden"
            {...register('image')}
            accept="image/*"
            type="file"
            id="coverImage"
          />
          <label htmlFor="coverImage" className="input cursor-pointer">
            {watch('image') && watch('image').length > 0
              ? watch('image')[0].name
              : 'Выберете картинку ресторана...'}
          </label>
          {errors.image?.message && (
            <FormError>{errors.image.message.toString()}</FormError>
          )}
          <Button loading={uploading}>Добавить ресторан</Button>
          {/* {data?.createRestaurant.error && (
          <FormError>{data.createRestaurant.error.message}</FormError>
        )} */}
        </form>
      </div>
    </div>
  )
}
