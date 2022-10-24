import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import colors from 'tailwindcss/colors'
import { DishCards } from '../../components/dish-cards'
import { graphql } from '../../gql'
import { notify } from '../../toast'

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

const PromotionPayment_Mutation = graphql(`
  mutation PromotionPayment_Mutation($input: PromotionPaymentInput!) {
    promotionPayment(input: $input) {
      result {
        confirmationToken
        transactionId
      }
    }
  }
`)

const CreatePayment_Mutation = graphql(`
  mutation CreatePayment_Mutation($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`)

type Params = {
  id: string
}

export const MyRestaurantPage = () => {
  const [isProcessPayment, setIsProcessPayment] = useState(false)
  const restaurantId = Number(useParams<Params>().id)
  const { data } = useQuery(MyRestaurantRoute_Query, {
    variables: { input: { id: restaurantId } },
  })
  const [promotionPayment] = useMutation(PromotionPayment_Mutation)
  const [createPayment] = useMutation(CreatePayment_Mutation, {
    onCompleted: ({ createPayment: { ok, error } }) => {
      if (error) {
        notify.error(error)
      }
      if (ok) {
        notify.success('Платеж успешно совершен')
      }
    },
  })

  const triggerPayment = async () => {
    setIsProcessPayment(true)
    const { data } = await promotionPayment({
      variables: { input: { restaurantId } },
    })
    const confirmationToken = data?.promotionPayment.result?.confirmationToken
    const transactionId = data?.promotionPayment.result?.transactionId

    if (confirmationToken && transactionId) {
      // @ts-ignore
      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token: confirmationToken,

        //При необходимости можно изменить цвета виджета, подробные настройки см. в документации
        customization: {
          // Настройка цветовой схемы, минимум один параметр, значения цветов в HEX
          colors: {
            // Цвет акцентных элементов: кнопка Заплатить, выбранные переключатели, опции и текстовые поля
            control_primary: colors.lime[600],
            control_primary_content: colors.white,
            background: colors.gray[100],
          },
        },
        error_callback: function (error: any) {
          console.log(error)
        },
      })

      checkout.on('success', () => {
        createPayment({ variables: { input: { restaurantId, transactionId } } })
        setIsProcessPayment(false)
        checkout.destroy()
      })
      checkout.on('fail', () => {
        toast.error('Платеж не прошел')
        setIsProcessPayment(false)
        checkout.destroy()
      })
      //Отображение платежной формы в контейнере
      checkout.render('payment-form')
    }
  }

  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.result?.name || 'Loading...'} | Number Eats
        </title>
        <script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" />
      </Helmet>
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
            className="mr-8 bg-gray-800 py-3 px-10 text-white"
            to={`/restaurant/${restaurantId}/add-dish`}
          >
            Add Dish &rarr;
          </Link>
          <button
            className="bg-lime-600 py-3 px-10 text-white disabled:bg-gray-300 disabled:text-gray-800"
            disabled={isProcessPayment}
            onClick={triggerPayment}
            type="button"
          >
            Buy Promotion &rarr;
          </button>
        </div>
        <div id="payment-form" />
        {data && <DishCards query={data} />}
      </div>
      {/* TODO: 20 Victory Charts */}
      <div>График продаж</div>
    </div>
  )
}
