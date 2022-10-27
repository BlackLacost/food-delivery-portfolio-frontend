import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { graphql } from '../../gql'

const RestaurantsByCategory_Query = graphql(`
  query RestaurantsByCategory_Query($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        id
        name
      }
      category {
        id
        name
      }
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
