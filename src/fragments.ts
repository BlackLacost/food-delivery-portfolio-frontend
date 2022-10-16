import { graphql } from './gql'

export const CoreRestaurantFieldsFragment = graphql(`
  fragment CoreRestaurantFields on Restaurant {
    id
    address
    category {
      name
    }
    coverImage
    isPromoted
    name
  }
`)
