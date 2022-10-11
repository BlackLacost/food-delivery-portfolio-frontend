import { gql, useQuery } from '@apollo/client'
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from '../gql/graphql'

const RESTAURANTS_QUERY = gql`
  query RestaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
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
export const useRestaurantsPage = (page: number = 1) => {
  return useQuery<RestaurantsPageQuery, RestaurantsPageQueryVariables>(
    RESTAURANTS_QUERY,
    { variables: { input: { page } } }
  )
}
