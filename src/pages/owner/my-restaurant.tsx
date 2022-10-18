import { useQuery } from '@apollo/client'
import { Link, useParams } from 'react-router-dom'
import { DishCards } from '../../components/dish-cards'
import { graphql } from '../../gql'

export const MyRestaurantRoute_Query = graphql(`
  query MyRestaurant_Query($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      result {
        coverImage
        name
      }
    }
    ...DishCards_QueryFragment
  }
`)

type Params = {
  id: string
}

export const MyRestaurantPage = () => {
  const { id } = useParams<Params>()
  const { data } = useQuery(MyRestaurantRoute_Query, {
    variables: { input: { id: Number(id) } },
  })

  return (
    <div>
      <div
        className="bg-gray-700 bg-cover bg-center py-28"
        style={{
          backgroundImage: `url(${data?.myRestaurant.result?.coverImage}`,
        }}
      ></div>
      <div className="container mt-10">
        <h1 className="mb-10 text-4xl">
          {data?.myRestaurant.result?.name ?? 'Loading...'}
        </h1>
        <div className="mb-8">
          <Link
            className="mr-8 bg-gray-800 py-3 px-10 text-white"
            to={`/restaurant/${id}/add-dish`}
          >
            Add Dish &rarr;
          </Link>
          <Link className="bg-lime-700 py-3 px-10 text-white" to={``}>
            Buy Promotion &rarr;
          </Link>
        </div>
        {data && <DishCards query={data} />}
      </div>
      {/* TODO: 20 Victory Charts */}
      <div>График продаж</div>
    </div>
  )
}
