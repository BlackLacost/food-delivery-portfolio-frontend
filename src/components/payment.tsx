import { useMutation } from '@apollo/client'
import { Dialog } from '@headlessui/react'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import colors from 'tailwindcss/colors'
import { graphql } from '../gql'
import { notify } from '../toast'

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

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

type Params = {
  id: string
}

export const Payment = ({ isOpen, setIsOpen }: Props) => {
  const [checkout, setCheckout] = useState<any>()
  const restaurantId = Number(useParams<Params>().id)
  const [isProcessPayment, setIsProcessPayment] = useState(false)
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

  const triggerPayment = useCallback(async () => {
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
      setCheckout(checkout)

      checkout.on('success', () => {
        createPayment({ variables: { input: { restaurantId, transactionId } } })
        setIsProcessPayment(false)
        setIsOpen(false)
        checkout.destroy()
      })
      checkout.on('fail', () => {
        toast.error('Платеж не прошел')
        setIsProcessPayment(false)
        setIsOpen(false)
        checkout.destroy()
      })
      //Отображение платежной формы в контейнере
      checkout.render('payment-form')
    }
  }, [createPayment, promotionPayment, restaurantId, setIsOpen])

  useEffect(() => {
    if (isOpen && !isProcessPayment) {
      triggerPayment()
    }
  }, [isOpen, isProcessPayment, triggerPayment])

  useEffect(() => {
    if (!isOpen && isProcessPayment) {
      setIsProcessPayment(false)
      checkout.destroy()
    }
  }, [isOpen, isProcessPayment, checkout, setIsProcessPayment])

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      as="div"
      className="fixed inset-0 overflow-y-auto bg-gray-500/75 p-4 pt-[5vh]"
    >
      <Dialog.Panel className="mx-auto max-w-xl rounded-xl bg-lime-600 shadow-2xl ring-1 ring-black/25">
        <div id="payment-form" className="pt-20" />
      </Dialog.Panel>
    </Dialog>
  )
}
