import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { graphql } from '../../gql'
import { Me } from '../../routers/LoggedInRouter'

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
  // const { data: userData, refetch: refetchMe } = useMe()
  const { data: userData } = useQuery(Me, { fetchPolicy: 'no-cache' })
  const navigate = useNavigate()
  const [verifyEmail] = useMutation(VerifyEmail, {
    update: async (cache, { data }) => {
      const error = data?.verifyEmail.error
      if (!error && userData) {
        // await refetchMe()
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
        <title>Verify Email | Доставка Еды</title>
      </Helmet>
      <h1 className="mb-2 text-lg font-semibold">Confirming email...</h1>
      <p className="text-sm text-gray-700">
        Please wait, don't close this page.
      </p>
    </div>
  )
}
