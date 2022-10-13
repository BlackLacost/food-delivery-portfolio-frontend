import { gql, useLazyQuery } from '@apollo/client'
import { RESTAURANT_FRAGMENT } from '../fragments'
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from '../gql/graphql'

const SEARCH_RESTAURANT_QUERY = gql`
  query SearchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`

export const useLazySearchRestaurant = () => {
  return useLazyQuery<SearchRestaurantQuery, SearchRestaurantQueryVariables>(
    SEARCH_RESTAURANT_QUERY
  )
}
