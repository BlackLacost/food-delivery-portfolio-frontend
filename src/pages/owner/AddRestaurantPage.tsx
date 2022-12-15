import { useMutation } from '@apollo/client'
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

export const AddRestaurantPage = () => {
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
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

  const onSubmit: SubmitHandler<CreateRestaurantForm> = async ({
    name,
    categoryName,
    image,
  }) => {
    try {
      setUploading(true)
      const actualImage = image[0]
      const formBody = new FormData()
      formBody.append('file', actualImage)
      const response = await fetch(
        `${process.env.REACT_APP_GRAPHQL_HTTP}/uploads/`,
        {
          method: 'POST',
          body: formBody,
        }
      )
      const { url: coverImage } = await response.json()
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

  const [restaurantPosition, setRestaurantPosition] = React.useState<Position>(
    {}
  )

  return (
    <div className="mx-auto flex w-full max-w-screen-sm flex-col space-y-4">
      <Helmet>
        <title>Добавить ресторан | Доставка Еды</title>
      </Helmet>
      <H1>Добавить ресторан</H1>
      <form className="grid gap-3 pb-10" onSubmit={handleSubmit(onSubmit)}>
        <GetAddress
          position={restaurantPosition}
          setPosition={setRestaurantPosition}
        />
        <input className="input" {...register('name')} placeholder="Name" />
        <input
          className="input"
          {...register('categoryName')}
          placeholder="Category"
        />
        <input
          className="input"
          {...register('image')}
          accept="image/*"
          type="file"
        />
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
