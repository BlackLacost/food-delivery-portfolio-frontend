import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { Payment } from '../../components/Payment'
import { DishCards } from '../../features/restaurant/dish-card/DishCards'
import { RestaurantImageDescription } from '../../features/restaurant/RestaurantImageDescription'
import { graphql } from '../../gql'

export const MyRestaurantRoute_Query = graphql(`
  query MyRestaurant_Query($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      restaurant {
        name
        ...ImageDescription_RestaurantFragment
      }
    }
    ...DishCards_QueryFragment
  }
`)

type Params = {
  id: string
}

export const MyRestaurantPage = () => {
  const [isOpenPayment, setIsOpenPayment] = useState(false)
  const restaurantId = Number(useParams<Params>().id)
  const { data } = useQuery(MyRestaurantRoute_Query, {
    variables: { input: { id: restaurantId } },
  })

  const restaurant = data?.myRestaurant.restaurant

  return (
    <div>
      <Helmet>
        <title>{restaurant?.name || 'Loading...'} | Number Eats</title>
        <script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" />
      </Helmet>
      <Payment isOpen={isOpenPayment} setIsOpen={setIsOpenPayment} />
      {restaurant && <RestaurantImageDescription restaurant={restaurant} />}
      <div className="container mt-10">
        <div className="mb-8 flex flex-wrap justify-end gap-4">
          <Link
            className="bg-gray-800 p-3 text-white"
            to={`/restaurant/${restaurantId}/add-dish`}
          >
            Добавить товар &rarr;
          </Link>
          <Link
            className="bg-gray-800 p-3 text-white"
            to={`/restaurant/${restaurantId}/orders`}
          >
            Заказы &rarr;
          </Link>
          <button
            className="bg-primary-600 p-3 text-white focus:outline-none focus:ring-1 focus:ring-gray-800 disabled:text-gray-800"
            onClick={() => setIsOpenPayment(true)}
            type="button"
          >
            Реклама &rarr;
          </button>
        </div>

        {data && <DishCards query={data} />}
      </div>
      {/* TODO: 20 Victory Charts */}
      {/* <div>График продаж</div> */}
    </div>
  )
}
