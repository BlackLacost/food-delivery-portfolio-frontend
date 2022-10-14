import { graphql } from './gql'

export const CoreCategoryFieldsFragment = graphql(`
  fragment CoreCategoryFields on Category {
    id
    coverImage
    name
    restaurantCount
    slug
  }
`)

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
