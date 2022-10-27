import { HTMLAttributes } from 'react'
import { FragmentType, graphql, useFragment } from '../gql'
import { RestaurantCard } from './RestaurantCard'

const Restaurants_QueryFragment = graphql(`
  fragment Restaurants_QueryFragment on Query {
    restaurants(input: $input) {
      results {
        id
        ...Card_RestaurantFragment
      }
    }
  }
`)

const MyRestaurants_QueryFragment = graphql(`
  fragment MyRestaurants_QueryFragment on Query {
    myRestaurants {
      results {
        id
        ...Card_RestaurantFragment
      }
    }
  }
`)

type Props = HTMLAttributes<HTMLDivElement> & {
  // TODO: Learn narrowing FragmentType and make query Union
  clientQuery: FragmentType<typeof Restaurants_QueryFragment> | undefined
  ownerQuery: FragmentType<typeof MyRestaurants_QueryFragment> | undefined
}

export const RestaurantsCards = ({
  clientQuery,
  ownerQuery,
  className,
  ...rest
}: Props) => {
  const restaurants = useFragment(Restaurants_QueryFragment, clientQuery)
    ?.restaurants.results
  const myRestaurants = useFragment(MyRestaurants_QueryFragment, ownerQuery)
    ?.myRestaurants.results

  return (
    <div
      className={`grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3 ${className}`}
      {...rest}
    >
      {(restaurants || myRestaurants || []).map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}
