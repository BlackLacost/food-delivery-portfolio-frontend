import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { DishCardClient } from '../../components/dish-card/DishCardClient'
import { graphql } from '../../gql'
import {
  CreateOrderItemInput,
  OrderItemOptionInputType,
} from '../../gql/graphql'
import { notify } from '../../toast'

const RestaurantRoute_Query = graphql(`
  query Restaurant_Query($input: RestaurantInput!) {
    restaurant(input: $input) {
      restaurant {
        id
        address
        category {
          name
        }
        coverImage
        isPromoted
        name
        menu {
          id
          ...CardClient_DishFragment
        }
      }
    }
  }
`)

const CreateOrder_Mutation = graphql(`
  mutation CreateOrder_Mutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`)

type Params = {
  id: string
}

export const RestaurantPage = () => {
  const params = useParams<Params>()
  const navigate = useNavigate()
  const restaurantId = Number(params.id)
  const { data } = useQuery(RestaurantRoute_Query, {
    variables: { input: { restaurantId } },
  })
  const restaurant = data?.restaurant.restaurant

  const [orderStarted, setOrderStarted] = useState(false)
  const [dishesOrder, setDishesOrder] = useState<CreateOrderItemInput[]>([])
  const triggerStartOrder = () => {
    setOrderStarted(true)
  }

  const isSelectedDish = (dishId: number) => Boolean(getDish(dishId))
  const isSelectedDishOption = (
    dishId: number,
    option: OrderItemOptionInputType
  ) => {
    return Boolean(
      getDish(dishId)?.options?.find((o) => o.name === option.name)
    )
  }

  const addDishToOrder = (dish: CreateOrderItemInput): void => {
    setDishesOrder((order) => [...order, dish])
  }

  const removeDishFromOrder = (dishId: number): void => {
    setDishesOrder((current) => {
      return current.filter((order) => order.dishId !== dishId)
    })
  }

  const getDish = (dishId: number) =>
    dishesOrder.find((order) => order.dishId === dishId)

  const toggleDishOption = (
    dishId: number,
    option: OrderItemOptionInputType
  ) => {
    const dish = getDish(dishId)
    if (!dish) return

    if (dish.options) {
      const existingOption = dish.options?.find((o) => o.name === option.name)
      if (existingOption) {
        dish.options = dish.options.filter((o) => o.name !== option.name)
      } else {
        dish.options = [...dish.options, option]
      }
    } else {
      dish.options = [option]
    }
    removeDishFromOrder(dishId)
    addDishToOrder(dish)
  }

  const [orderMutation, { loading: loadingOrder }] = useMutation(
    CreateOrder_Mutation,
    {
      variables: { input: { restaurantId, items: dishesOrder } },
      onCompleted: ({ createOrder: { ok, error, orderId } }) => {
        if (ok) {
          navigate(`/order/${orderId}`)
          return
        }
        if (error) {
          notify.error(error)
        }
      },
    }
  )

  const triggerConfirmOrder = () => {
    const ok = window.confirm('You are about to place an order')
    if (ok) {
      orderMutation()
    }
  }

  const triggerCancleOrder = () => {
    setOrderStarted(false)
    setDishesOrder([])
  }

  return (
    <div>
      <div
        className="bg-gray-800 bg-cover bg-center py-48"
        style={{
          backgroundImage: `url(${restaurant?.coverImage})`,
        }}
      >
        <div className="w-96 bg-white py-5 pl-5">
          <h1 className="mb-3 text-4xl">{restaurant?.name}</h1>
          <p className="mb-2 text-sm font-light">
            {restaurant?.category?.name}
          </p>
          <p className="text-sm font-light">{restaurant?.address}</p>
        </div>
      </div>
      <section className="container my-10 flex flex-col items-end">
        {orderStarted ? (
          <div className="flex space-x-4">
            <Button
              onClick={triggerConfirmOrder}
              type="button"
              disabled={dishesOrder.length === 0 || loadingOrder}
            >
              Confirm Order
            </Button>
            <Button
              className="bg-gray-700 hover:bg-gray-800"
              onClick={triggerCancleOrder}
              type="button"
            >
              Cancel Order
            </Button>
          </div>
        ) : (
          <Button onClick={triggerStartOrder} type="button">
            Start Order
          </Button>
        )}
        <div className="my-10 grid w-full grid-cols-3 gap-4">
          {restaurant?.menu.map((dish) => (
            <DishCardClient
              key={dish.id}
              addDishToOrder={addDishToOrder}
              dish={dish}
              orderStarted={orderStarted}
              isSelected={isSelectedDish(dish.id)}
              isSelectedDishOption={isSelectedDishOption}
              removeDishFromOrder={removeDishFromOrder}
              toggleDishOption={toggleDishOption}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
