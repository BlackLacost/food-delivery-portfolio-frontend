import React from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardsFragmentDoc } from '../../../gql/graphql'
import { DishCardOwner } from './DishCardOwner'

graphql(`
  fragment DishCards on Query {
    myRestaurant(input: $input) {
      restaurant {
        menu {
          id
          ...DishCardOwner
        }
      }
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

type Props = {
  query: FragmentType<typeof DishCardsFragmentDoc>
}

export const DishCards: React.FC<Props> = ({ query }) => {
  const menu = useFragment(DishCardsFragmentDoc, query).myRestaurant.restaurant
    ?.menu

  if (menu?.length === 0) {
    return (
      <section>
        <p className="mb-5 text-xl">Пока еще не блюд.</p>
      </section>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {menu?.map((dish) => (
        <DishCardOwner key={dish.id} dish={dish} />
      ))}
    </section>
  )
}
