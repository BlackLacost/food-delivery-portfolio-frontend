import { useQuery } from '@apollo/client'
import { CoreRestaurantFieldsFragment } from '../../fragments'
import { FragmentType, graphql, useFragment } from '../../gql'

export const MyRestaurants = graphql(`
  query MyRestaurants {
    myRestaurants {
      ok
      error
      results {
        ...CoreRestaurantFields
      }
    }
  }
`)

export const MyRestaurantsPage = () => {
  const { data, loading } = useQuery(MyRestaurants)
  const restaurants = useFragment(
    CoreRestaurantFieldsFragment,
    data?.myRestaurants.results as FragmentType<
      typeof CoreRestaurantFieldsFragment
    >[]
  )
  console.log({ data, restaurants })
  return <div>My Restaurants</div>
}
