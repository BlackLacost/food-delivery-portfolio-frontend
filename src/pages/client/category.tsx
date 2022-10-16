import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import {
  CoreCategoryFieldsFragment,
  CoreRestaurantFieldsFragment,
} from '../../fragments'
import { FragmentType, graphql, useFragment } from '../../gql'

type Params = {
  slug: string
}

const GetRestaurantsByCategory = graphql(`
  query GetRestaurantsByCategory($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...CoreRestaurantFields
      }
      category {
        ...CoreCategoryFields
      }
    }
  }
`)

export default function CategoryPage() {
  const { slug } = useParams<Params>()
  const { data } = useQuery(GetRestaurantsByCategory, {
    variables: { input: { slug: slug as string } },
  })

  const category = useFragment(
    CoreCategoryFieldsFragment,
    data?.category.category as FragmentType<typeof CoreCategoryFieldsFragment>
  )

  const restaurants = useFragment(
    CoreRestaurantFieldsFragment,
    data?.category.restaurants as FragmentType<
      typeof CoreRestaurantFieldsFragment
    >[]
  )
  console.log({ data, category, restaurants })
  return <div>Category</div>
}
