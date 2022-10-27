import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { DishCards } from '../../components/DishCards'
import { Payment } from '../../components/Payment'
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
  const [isOpenPayment, setIsOpenPayment] = useState(false)
  const restaurantId = Number(useParams<Params>().id)
  const { data } = useQuery(MyRestaurantRoute_Query, {
    variables: { input: { id: restaurantId } },
  })

  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.result?.name || 'Loading...'} | Number Eats
        </title>
        <script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" />
      </Helmet>
      <Payment isOpen={isOpenPayment} setIsOpen={setIsOpenPayment} />
      <div
        className="bg-gray-600 bg-cover bg-center py-28"
        style={{
          backgroundImage: `url(${data?.myRestaurant.result?.coverImage}`,
        }}
      />
      <div className="container mt-10">
        <h1 className="mb-10 text-4xl">
          {data?.myRestaurant.result?.name ?? 'Loading...'}
        </h1>
        <div className="mb-8">
          <Link
            className="mr-8 bg-gray-800  py-3 px-10 text-white"
            to={`/restaurant/${restaurantId}/add-dish`}
          >
            Add Dish &rarr;
          </Link>
          <button
            className="bg-lime-600 py-3 px-10 text-white focus:outline-none focus:ring-1 focus:ring-gray-800 disabled:text-gray-800"
            onClick={() => setIsOpenPayment(true)}
            type="button"
          >
            Buy Promotion &rarr;
          </button>
        </div>

        {data && <DishCards query={data} />}
      </div>
      {/* TODO: 20 Victory Charts */}
      <div>График продаж</div>
    </div>
  )
}
