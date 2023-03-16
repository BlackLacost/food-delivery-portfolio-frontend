import React from 'react'
import { IconButton } from '../../../components/IconButton'
import { Rub } from '../../../components/Rub'
import { FragmentType, graphql, useFragment } from '../../../gql'
import {
  CreateOrderItemInput,
  DishCardClientFragmentDoc,
  OrderItemOptionInputType,
} from '../../../gql/graphql'
import { DishCardContainer } from './DishCardContainer'
import { DishCardImage } from './DishCardImage'
import { DishCardPrice } from './DishCardPrice'
import { DishCardTitle } from './DishCardTitle'

graphql(`
  fragment DishCardClient on Dish {
    id
    ...DishCardTitle
    ...DishCardImage
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
  dish: FragmentType<typeof DishCardClientFragmentDoc>
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
  const dish = useFragment(DishCardClientFragmentDoc, rest.dish)

  const onOptionClick = (
    dishId: number,
    dishOption: OrderItemOptionInputType
  ) => {
    if (!orderStarted) return
    toggleDishOption(dishId, { name: dishOption.name })
  }

  return (
    <DishCardContainer isSelected={isSelected}>
      <DishCardImage dish={dish} />
      <div className="flex items-start justify-between">
        {orderStarted && (
          <div className="absolute right-0 top-[-6px]">
            {isSelected ? (
              <IconButton
                icon="minus"
                type="button"
                onClick={() => removeDishFromOrder(dish.id)}
              />
            ) : (
              <IconButton
                icon="plus"
                type="button"
                onClick={() => addDishToOrder({ dishId: dish.id })}
              />
            )}
          </div>
        )}
      </div>
      <DishCardPrice>{dish.price}</DishCardPrice>
      <DishCardTitle dish={dish} />

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
