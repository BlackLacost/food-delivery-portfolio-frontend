import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { DishCardClient } from '../../features/restaurant/dish-card/DishCardClient'
import { RestaurantImageDescription } from '../../features/restaurant/RestaurantImageDescription'
import { graphql } from '../../gql'
import {
  CreateOrderItemInput,
  OrderItemOptionInputType,
  OrderStatus,
} from '../../gql/graphql'
import { notify } from '../../toast'
import { GetClientOrdersRoute_Query } from './ClientOrdersPage'

const RestaurantRoute_Query = graphql(`
  query Restaurant_Query($input: RestaurantInput!) {
    getRestaurant(input: $input) {
      restaurant {
        ...ImageDescription_RestaurantFragment
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
      order {
        id
      }
      error {
        ... on Error {
          message
        }
      }
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
  const restaurant = data?.getRestaurant.restaurant

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
      onError: ({ message }) => notify.error(message),
      onCompleted: ({ createOrder: { error } }) => {
        if (error) return notify.error(error.message)
        navigate('/orders')
      },
      refetchQueries: [
        {
          query: GetClientOrdersRoute_Query,
          variables: {
            input: {
              statuses: [
                OrderStatus.Pending,
                OrderStatus.Cooking,
                OrderStatus.Cooked,
                OrderStatus.Accepted,
                OrderStatus.PickedUp,
              ],
            },
          },
        },
      ],
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
      {restaurant && <RestaurantImageDescription restaurant={restaurant} />}
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
        <div className="my-10 grid w-full grid-cols-2 gap-4">
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
