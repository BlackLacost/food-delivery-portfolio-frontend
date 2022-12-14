import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { FormError } from '../../components/FormError'
import { H1 } from '../../components/H1'
import { GetAddress, Position } from '../../features/yandex-map/GetAddress'
import {
  CreateRestaurantForm,
  createRestaurantSchema,
} from '../../form.schemas'
import { graphql } from '../../gql'
import { notify } from '../../toast'
import { uploadImage } from '../utils/upload-image'
import { MyRestaurantsRoute_Query } from './MyRestaurantsPage'

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
    mode: 'onChange',
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
    refetchQueries: [{ query: MyRestaurantsRoute_Query }],
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
        return notify.error('?????????? ?????????????????? ????????????????????')
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
        <title>???????????????? ???????????????? | ???????????????? ??????</title>
      </Helmet>
      <H1>???????????????? ????????????????</H1>
      <form className="grid gap-3 pb-10" onSubmit={handleSubmit(onSubmit)}>
        <GetAddress
          position={restaurantPosition}
          setPosition={setRestaurantPosition}
        />
        <input className="input" {...register('name')} placeholder="Name" />
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
            : '???????????????? ???????????????? ??????????????????...'}
        </label>
        {errors.image?.message && (
          <FormError>{errors.image.message.toString()}</FormError>
        )}
        <Button canClick={isValid} loading={uploading}>
          Create Restaurant
        </Button>
        {/* {data?.createRestaurant.error && (
          <FormError>{data.createRestaurant.error.message}</FormError>
        )} */}
      </form>
    </div>
  )
}
