import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { graphql } from '../../gql'

const RestaurantsByCategory_Query = graphql(`
  query RestaurantsByCategory_Query($input: CategoryInput!) {
    category(input: $input) {
      category {
        id
        name
      }
      error {
        ... on Error {
          message
        }
      }
      restaurants {
        id
        name
      }
      totalPages
      totalResults
    }
  }
`)

type Params = {
  slug: string
}

export const CategoryPage = () => {
  const { slug } = useParams<Params>()
  const { data } = useQuery(RestaurantsByCategory_Query, {
    variables: { input: { slug: slug as string } },
  })

  console.log({ data })
  return <div>Category</div>
}
