import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/button'
import { AddDishForm, addDishSchema } from '../../form.schemas'
import { graphql } from '../../gql'
import { MyRestaurantRoute_Query } from './my-restaurant'

const AddDishRoute_Mutation = graphql(`
  mutation AddDish_Mutation($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`)

export const AddDishPage = () => {
  const params = useParams<{ id: string }>()
  const restaurantId = Number(params.id)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddDishForm>({
    mode: 'onChange',
    resolver: yupResolver(addDishSchema),
  })

  const [addDish, { loading }] = useMutation(AddDishRoute_Mutation, {
    onCompleted: ({ createDish: { ok } }) => {
      if (ok) {
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

  const onSubmit: SubmitHandler<AddDishForm> = ({
    name,
    description,
    price,
  }) => {
    addDish({
      variables: {
        input: { name, description, price, restaurantId },
      },
    })
  }

  return (
    <div className="container flex flex-col items-center">
      <Helmet>
        <title>Add Dish | Uber Eats</title>
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
          className="input"
          {...register('price')}
          type="number"
          min={0}
          placeholder="Price"
        />
        <Button canClick={isValid} loading={loading}>
          Add Dish
        </Button>
      </form>
    </div>
  )
}
