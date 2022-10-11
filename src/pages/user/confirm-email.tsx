import { gql, useApolloClient, useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from '../../gql/graphql'
import { useMe } from '../../hooks/useMe'

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`

export const ConfirmEmail = () => {
  const { data: userData } = useMe()
  const navigate = useNavigate()
  const client = useApolloClient()
  const [verifyEmail] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted: (data) => {
      const {
        verifyEmail: { ok },
      } = data
      if (ok && userData) {
        client.writeFragment({
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
      <h1 className="mb-2 text-lg font-semibold">Confirming email...</h1>
      <p className="text-sm text-gray-700">
        Please wait, don't close this page.
      </p>
    </div>
  )
}
