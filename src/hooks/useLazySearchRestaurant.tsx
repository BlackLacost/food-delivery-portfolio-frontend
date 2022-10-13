import { gql, useLazyQuery } from '@apollo/client'
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
        id
        name
        coverImage
        address
        isPromoted
        category {
          name
        }
      }
    }
  }
`

export const useLazySearchRestaurant = () => {
  return useLazyQuery<SearchRestaurantQuery, SearchRestaurantQueryVariables>(
    SEARCH_RESTAURANT_QUERY
  )
}
