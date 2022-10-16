import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../../components/button'
import { FormError } from '../../components/form-error'
import {
  CreateRestaurantForm,
  createRestaurantSchema,
} from '../../form.schemas'
import { graphql } from '../../gql'

const CreateRestaurant = graphql(`
  mutation CreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`)

export const AddRestaurantPage = () => {
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateRestaurantForm>({
    mode: 'onChange',
    resolver: yupResolver(createRestaurantSchema),
  })

  const [createRestaurant, { data }] = useMutation(CreateRestaurant, {
    onCompleted: (data) => data.createRestaurant.ok && setUploading(false),
  })

  const onSubmit: SubmitHandler<CreateRestaurantForm> = async ({
    name,
    address,
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
      console.log(name, categoryName, address, coverImage)
      createRestaurant({
        variables: { input: { name, categoryName, address, coverImage } },
      })
    } catch (error) {
      console.log(error)
    }
    // createRestaurant({ variables: { input: data } })
  }
  return (
    <div>
      <Helmet>
        <title>Add Restaurant | Uber Eats</title>
      </Helmet>
      <h1>add-restaurant</h1>
      <form className="grid max-w-sm gap-3" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" {...register('name')} placeholder="Name" />
        <input
          className="input"
          {...register('address')}
          placeholder="Address"
        />
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
