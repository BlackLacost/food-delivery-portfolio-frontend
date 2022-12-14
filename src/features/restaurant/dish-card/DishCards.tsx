import React from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardOwner } from './DishCardOwner'

export const DishCards_QueryFragment = graphql(`
  fragment DishCards_QueryFragment on Query {
    myRestaurant(input: $input) {
      restaurant {
        menu {
          id
          ...CardOwner_DishFragment
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
  query: FragmentType<typeof DishCards_QueryFragment>
}

export const DishCards: React.FC<Props> = ({ query }) => {
  const menu = useFragment(DishCards_QueryFragment, query).myRestaurant
    .restaurant?.menu

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
