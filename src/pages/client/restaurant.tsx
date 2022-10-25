import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { DishCard } from '../../components/dish-card'
import { graphql } from '../../gql'

const RestaurantRoute_Query = graphql(`
  query Restaurant_Query($input: RestaurantInput!) {
    restaurant(input: $input) {
      restaurant {
        id
        address
        category {
          name
        }
        coverImage
        isPromoted
        name
        menu {
          id
          ...Card_DishFragment
        }
      }
    }
  }
`)

type Params = {
  id: string
}

export const RestaurantPage = () => {
  const { id } = useParams<Params>()
  const { data } = useQuery(RestaurantRoute_Query, {
    variables: { input: { restaurantId: Number(id) } },
  })
  const restaurant = data?.restaurant.restaurant

  return (
    <div>
      <div
        className="bg-gray-800 bg-cover bg-center py-48"
        style={{
          backgroundImage: `url(${restaurant?.coverImage})`,
        }}
      >
        <div className="w-96 bg-white py-5 pl-5">
          <h1 className="mb-3 text-4xl">{restaurant?.name}</h1>
          <p className="mb-2 text-sm font-light">
            {restaurant?.category?.name}
          </p>
          <p className="text-sm font-light">{restaurant?.address}</p>
        </div>
      </div>
      <section className="container my-10 grid grid-cols-3 gap-4">
        {restaurant?.menu.map((dish) => (
          <DishCard key={dish.id} dish={dish} isCustomer />
        ))}
      </section>
    </div>
  )
}
