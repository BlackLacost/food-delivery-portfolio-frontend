import { useQuery } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { AddRestaurantButton } from '../../features/restaurant/AddRestaurantButton'
import { RestaurantsCards } from '../../features/restaurant/RestaurantsCards'
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
        <title>Мои рестораны | Доставка Еды</title>
      </Helmet>
      <div className="container mt-12">
        <h1 className="mb-10 text-4xl">Мои рестораны</h1>
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
