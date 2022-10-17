import { useQuery } from '@apollo/client'
import { Link, useParams } from 'react-router-dom'
import { graphql } from '../../gql'

export const MyRestaurantRoute_Query = graphql(`
  query MyRestaurant_Query($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      result {
        coverImage
        name
        menu {
          name
        }
      }
    }
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
        <div>
          {data?.myRestaurant.result?.menu.length === 0 ? (
            <>
              <p className="mb-5 text-xl">No dishes here. Please add a dish!</p>
              <Link className="link text-lime-600" to="/add-restaurant">
                Create one &rarr;
              </Link>
            </>
          ) : (
            <div>
              {JSON.stringify(data?.myRestaurant.result?.menu, null, 2)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
