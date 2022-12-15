import { useQuery } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { RestaurantsCards } from '../../components/RestaurantsCards'
import { AddRestaurantButton } from '../../features/restaurant/AddRestaurantButton'
import { graphql } from '../../gql'

export const MyRestaurantsRoute_Query = graphql(`
  query MyRestaurants_Query {
    myRestaurants {
      restaurants {
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
        {data?.myRestaurants.restaurants && (
          <div className="flex flex-col space-y-4">
            <AddRestaurantButton
              restaurantsCount={data.myRestaurants.restaurants.length}
            />
            <RestaurantsCards ownerQuery={data} clientQuery={undefined} />
          </div>
        )}
      </div>
    </div>
  )
}
