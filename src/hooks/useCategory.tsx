import { gql, useQuery } from '@apollo/client'
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../fragments'
import { CategoryQuery, CategoryQueryVariables } from '../gql/graphql'

const CATEGORY_QUERY = gql`
  query Category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`

type Props = {
  slug: string
}

export const useCategory = ({ slug }: Props) => {
  return useQuery<CategoryQuery, CategoryQueryVariables>(CATEGORY_QUERY, {
    variables: { input: { slug } },
  })
}
