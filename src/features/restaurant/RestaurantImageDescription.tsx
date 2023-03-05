import React from 'react'
import { FragmentType, graphql, useFragment } from '../../gql'
import { RestaurantImageDescriptionFragmentDoc } from '../../gql/graphql'

graphql(`
  fragment RestaurantImageDescription on Restaurant {
    address
    category {
      name
    }
    coverImage
    name
  }
`)

type Props = {
  restaurant: FragmentType<typeof RestaurantImageDescriptionFragmentDoc>
}

export const RestaurantImageDescription: React.FC<Props> = (props) => {
  const restaurant = useFragment(
    RestaurantImageDescriptionFragmentDoc,
    props.restaurant
  )

  return (
    <div
      className="bg-gray-800 bg-cover bg-center py-20"
      style={{
        backgroundImage: `url(${restaurant.coverImage})`,
      }}
    >
      <div className="w-96 bg-white py-5 pl-5">
        <h1 className="mb-3 text-4xl">{restaurant.name}</h1>
        <p className="mb-2 text-sm font-light">{restaurant.category?.name}</p>
        <p className="text-sm font-light">{restaurant.address}</p>
      </div>
    </div>
  )
}
