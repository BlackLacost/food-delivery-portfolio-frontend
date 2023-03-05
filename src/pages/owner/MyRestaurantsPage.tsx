import { useQuery } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { AddRestaurantButton } from '../../features/restaurant/AddRestaurantButton'
import { RestaurantCard } from '../../features/restaurant/RestaurantCard'
import { graphql } from '../../gql'
import { MyRestaurantsDocument } from '../../gql/graphql'

graphql(`
  query MyRestaurants {
    myRestaurants {
      restaurants {
        id
        ...Card_Restaurant
      }
    }
  }
`)

export const MyRestaurantsPage = () => {
  const { data } = useQuery(MyRestaurantsDocument)

  if (!data?.myRestaurants.restaurants) return null

  const { restaurants } = data.myRestaurants

  return (
    <div>
      <Helmet>
        <title>Мои рестораны | Доставка Еды</title>
      </Helmet>
      <div className="container mt-12">
        <h1 className="mb-10 text-4xl">Мои рестораны</h1>
        <div className="flex flex-col space-y-4">
          <AddRestaurantButton
            restaurantsCount={data.myRestaurants.restaurants.length}
          />
          {/* <RestaurantsCards ownerQuery={data} clientQuery={undefined} /> */}
          <div
            className={`my-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3`}
          >
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
