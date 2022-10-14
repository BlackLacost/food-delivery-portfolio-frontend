import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { CoreRestaurantFieldsFragment } from '../../fragments'
import { FragmentType, graphql, useFragment } from '../../gql'

const GetRestaurant = graphql(`
  query GetRestaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...CoreRestaurantFields
      }
    }
  }
`)

type Params = {
  id: string
}

export default function RestaurantPage() {
  const { id } = useParams<Params>()
  const { data, loading } = useQuery(GetRestaurant, {
    variables: { input: { restaurantId: Number(id) } },
  })

  const restaurant = useFragment(
    CoreRestaurantFieldsFragment,
    data?.restaurant.restaurant as FragmentType<
      typeof CoreRestaurantFieldsFragment
    >
  )
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
    </div>
  )
}
