import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { FormError } from '../../components/FormError'
import { GetAddress, Position } from '../../components/Yandex/GetAddress'
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
      ok
      error
      restaurantId
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

  const [createRestaurant, { data }] = useMutation(CreateRestaurant, {
    onCompleted: ({ createRestaurant: { ok } }) => {
      if (ok) {
        setUploading(false)
        navigate('/')
      }
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
      const response = await fetch('http://localhost:4000/uploads/', {
        method: 'POST',
        body: formBody,
      })
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
    <div>
      <Helmet>
        <title>Add Restaurant | Uber Eats</title>
      </Helmet>
      <h1>add-restaurant</h1>
      <form
        className="mx-auto grid w-full max-w-screen-sm gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        {data?.createRestaurant.error && (
          <FormError>{data.createRestaurant.error}</FormError>
        )}
      </form>
    </div>
  )
}
