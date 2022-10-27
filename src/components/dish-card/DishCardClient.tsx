import React from 'react'
import { FragmentType, graphql, useFragment } from '../../gql'
import {
  CreateOrderItemInput,
  OrderItemOptionInputType,
} from '../../gql/graphql'
import { DishCardContainer } from './DishCardContainer'
import { DishCardTitle } from './DishCardTitle'

export const CardClient_DishFragment = graphql(`
  fragment CardClient_DishFragment on Dish {
    id
    ...CardTitle_DishFragment
    price
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`)

type Props = {
  addDishToOrder: (dish: CreateOrderItemInput) => void
  toggleDishOption: (dishId: number, option: OrderItemOptionInputType) => void
  dish: FragmentType<typeof CardClient_DishFragment>
  isSelected: boolean
  isSelectedDishOption: (
    dishId: number,
    option: OrderItemOptionInputType
  ) => boolean
  orderStarted: boolean
  removeDishFromOrder: (dishId: number) => void
}

export const DishCardClient: React.FC<Props> = ({
  addDishToOrder,
  toggleDishOption,
  isSelected,
  isSelectedDishOption,
  orderStarted,
  removeDishFromOrder,
  ...rest
}) => {
  const dish = useFragment(CardClient_DishFragment, rest.dish)

  const onOptionClick = (
    dishId: number,
    dishOption: OrderItemOptionInputType
  ) => {
    if (!orderStarted) return
    toggleDishOption(dishId, { name: dishOption.name })
  }

  return (
    <DishCardContainer isSelected={isSelected}>
      <div className="flex items-start justify-between">
        <DishCardTitle dish={dish} />
        {orderStarted &&
          (isSelected ? (
            <button
              className="bg-red-500 py-1 px-2 font-semibold text-white"
              type="button"
              onClick={() => removeDishFromOrder(dish.id)}
            >
              Remove
            </button>
          ) : (
            <button
              className="bg-lime-600 py-1 px-2 font-semibold text-white"
              type="button"
              onClick={() => addDishToOrder({ dishId: dish.id })}
            >
              Add
            </button>
          ))}
      </div>
      <p>{dish.price} руб.</p>

      {dish.options?.length !== 0 && (
        <div className="my-4">
          <h3 className="my-1 font-semibold">Dish options:</h3>
          <div className="flex flex-col space-y-3">
            {dish.options?.map((option, index) => (
              <div
                className={`flex items-center space-x-3 border p-2 ${
                  orderStarted &&
                  isSelected &&
                  isSelectedDishOption(dish.id, option)
                    ? 'cursor-pointer border-black'
                    : 'cursor-pointer border-white'
                }`}
                key={index}
                onClick={() => onOptionClick(dish.id, option)}
              >
                <p>{option.name}</p>
                <p className="text-sm text-gray-800">{option.extra} руб.</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DishCardContainer>
  )
}
