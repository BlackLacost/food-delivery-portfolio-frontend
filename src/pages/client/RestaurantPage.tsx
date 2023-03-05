import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { DishCardClient } from '../../features/restaurant/dish-card/DishCardClient'
import { RestaurantImageDescription } from '../../features/restaurant/RestaurantImageDescription'
import { graphql } from '../../gql'
import {
  CreateOrderDocument,
  CreateOrderItemInput,
  GetClientOrdersDocument,
  GetRestaurantDocument,
  OrderItemOptionInputType,
  OrderStatus,
} from '../../gql/graphql'
import { notify } from '../../toast'

graphql(`
  query GetRestaurant($input: RestaurantInput!) {
    getRestaurant(input: $input) {
      restaurant {
        ...RestaurantImageDescription
        menu {
          id
          ...DishCardClient
        }
      }
    }
  }
`)

graphql(`
  mutation CreateOrder($input: CreateOrderInput!) {
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
  const { data } = useQuery(GetRestaurantDocument, {
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
    CreateOrderDocument,
    {
      variables: { input: { restaurantId, items: dishesOrder } },
      onError: ({ message }) => notify.error(message),
      onCompleted: ({ createOrder: { error } }) => {
        if (error) return notify.error(error.message)
        navigate('/orders')
      },
      refetchQueries: [
        {
          query: GetClientOrdersDocument,
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

  const triggerConfirmOrder = () => orderMutation()

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
              Подтвердить заказ
            </Button>
            <Button
              className="bg-gray-700 hover:bg-gray-800"
              onClick={triggerCancleOrder}
              type="button"
            >
              Отменить заказ
            </Button>
          </div>
        ) : (
          <Button onClick={triggerStartOrder} type="button">
            Сформировать заказ
          </Button>
        )}
        <div className="my-10 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
