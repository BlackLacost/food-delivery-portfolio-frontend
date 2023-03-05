import { useQuery } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { RestaurantCard } from '../../features/restaurant/RestaurantCard'
import { graphql } from '../../gql'

const RestaurantsByCategory_Query = graphql(`
  query RestaurantsByCategory_Query($input: CategoryInput!) {
    category(input: $input) {
      category {
        id
        name
      }
      error {
        ... on Error {
          message
        }
      }
      restaurants {
        id
        ...Card_Restaurant
      }
    }
  }
`)

type Params = {
  slug: string
}

export const CategoryPage = () => {
  const { slug } = useParams<Params>()
  const { data } = useQuery(RestaurantsByCategory_Query, {
    variables: { input: { slug: slug as string } },
  })

  if (!data?.category) return null

  const { category, restaurants } = data.category

  console.log(restaurants)

  return (
    <div>
      <Helmet>
        <title>{category?.name ?? 'Категория товаров'} | Доставка Еды</title>
      </Helmet>
      <div className="mx-5 max-w-screen-xl xl:mx-auto">
        <div
          className={`my-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3`}
        >
          {(restaurants ?? []).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  )
}
