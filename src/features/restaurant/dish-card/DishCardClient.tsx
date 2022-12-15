import React from 'react'
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { Rub } from '../../../components/Rub'
import { FragmentType, graphql, useFragment } from '../../../gql'
import {
  CreateOrderItemInput,
  OrderItemOptionInputType,
} from '../../../gql/graphql'
import { DishCardContainer } from './DishCardContainer'
import { DishCardPrice } from './DishCardPrice'
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
        {orderStarted && (
          <div className="absolute right-0 top-[-14px]">
            {isSelected ? (
              <button
                type="button"
                onClick={() => removeDishFromOrder(dish.id)}
              >
                <AiFillMinusCircle className="h-10 w-10 text-danger-600" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => addDishToOrder({ dishId: dish.id })}
              >
                <AiFillPlusCircle className="h-10 w-10 text-primary-600" />
              </button>
            )}
          </div>
        )}
      </div>
      <DishCardPrice>{dish.price}</DishCardPrice>

      {orderStarted && isSelected && dish.options?.length !== 0 && (
        <div className="my-4">
          <h3 className="my-1 font-semibold">Выберете опции:</h3>
          <div className="flex flex-col">
            {dish.options?.map((option, index) => (
              <div
                className={`flex cursor-pointer items-center space-x-1`}
                key={index}
                onClick={() => onOptionClick(dish.id, option)}
              >
                <p
                  className={`flex-grow ${
                    isSelectedDishOption(dish.id, option) &&
                    'font-semibold text-primary-600'
                  }`}
                >
                  {option.name}
                </p>
                <p className="text-sm font-semibold text-primary-600">
                  {option.extra} <Rub />
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DishCardContainer>
  )
}
