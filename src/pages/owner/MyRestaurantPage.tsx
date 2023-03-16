import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Payment } from '../../components/Payment'
import { DishCards } from '../../features/restaurant/dish-card/DishCards'
import { RestaurantImageDescription } from '../../features/restaurant/RestaurantImageDescription'
import { graphql } from '../../gql'
import { MyRestaurantDocument } from '../../gql/graphql'

graphql(`
  query MyRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      restaurant {
        name
        ...RestaurantImageDescription
      }
    }
    ...DishCards
  }
`)

type Params = {
  id: string
}

export const MyRestaurantPage = () => {
  const [isOpenPayment, setIsOpenPayment] = useState(false)
  const restaurantId = Number(useParams<Params>().id)
  const { data } = useQuery(MyRestaurantDocument, {
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
            className="bg-gray-800 py-1 px-6 text-white"
            to={`/restaurant/${restaurantId}/add-dish`}
          >
            Добавить товар &rarr;
          </Link>
          <Link
            className="bg-gray-800 py-1 px-6 text-white"
            to={`/restaurant/${restaurantId}/orders`}
          >
            Заказы &rarr;
          </Link>
          <Button
            size="small"
            onClick={() => setIsOpenPayment(true)}
            type="button"
          >
            Реклама &rarr;
          </Button>
        </div>

        {data && <DishCards query={data} />}
      </div>
      {/* TODO: 20 Victory Charts */}
      {/* <div>График продаж</div> */}
    </div>
  )
}
