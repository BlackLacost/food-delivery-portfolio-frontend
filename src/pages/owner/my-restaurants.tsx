import { useQuery } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
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
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Uber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h1 className="mb-10 text-4xl">My Restaurants</h1>
        {data?.myRestaurants.ok && restaurants.length === 0 && (
          <>
            <p className="mb-5 text-xl">No restaurants here. Create One!</p>
            <Link className="link text-lime-600" to="/add-restaurant">
              Create one &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
