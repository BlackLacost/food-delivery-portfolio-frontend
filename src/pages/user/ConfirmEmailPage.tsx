import { gql, useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { graphql } from '../../gql'
import { useMe } from '../../hooks/useMe'

const VerifyEmail = graphql(`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

export const ConfirmEmailPage = () => {
  const { data: userData } = useMe()
  const navigate = useNavigate()
  const [verifyEmail] = useMutation(VerifyEmail, {
    update: async (cache, { data }) => {
      console.log({ data })
      const error = data?.verifyEmail.error
      if (!error && userData) {
        cache.writeFragment({
          id: `User:${userData.me.id}`,
          fragment: gql`
            fragment VerifiedUser on User {
              verified
            }
          `,
          data: {
            verified: true,
          },
        })
        navigate('/')
      }
    },
  })

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      verifyEmail({ variables: { input: { code } } })
    }
  }, [searchParams, verifyEmail])

  return (
    <div className="mt-52 flex flex-col items-center">
      <Helmet>
        <title>Проверка почты | Доставка Еды</title>
      </Helmet>
      <h1 className="mb-2 text-lg font-semibold">Подтверждение почты...</h1>
      <p className="text-sm text-gray-700">
        Подождите немного и не закрывайте страницу.
      </p>
    </div>
  )
}
