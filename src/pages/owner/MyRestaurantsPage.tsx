import { useQuery } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { RestaurantsCards } from '../../components/RestaurantsCards'
import { graphql } from '../../gql'

export const MyRestaurantsRoute_Query = graphql(`
  query MyRestaurants_Query {
    myRestaurants {
      ok
      results {
        id
      }
    }
    ...MyRestaurants_QueryFragment
  }
`)

export const MyRestaurantsPage = () => {
  const { data } = useQuery(MyRestaurantsRoute_Query)
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Uber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h1 className="mb-10 text-4xl">My Restaurants</h1>
        {data?.myRestaurants.ok && data?.myRestaurants.results?.length === 0 ? (
          <>
            <p className="mb-5 text-xl">No restaurants here. Create One!</p>
            <Link className="link text-lime-600" to="/add-restaurant">
              Create one &rarr;
            </Link>
          </>
        ) : (
          <RestaurantsCards ownerQuery={data} clientQuery={undefined} />
        )}
      </div>
    </div>
  )
}
