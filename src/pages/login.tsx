import { gql, useMutation } from '@apollo/client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormError } from '../components/form-error'
import {
  LoginInput,
  LoginMutation,
  LoginMutationVariables,
} from '../gql/graphql'

const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>()

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const {
        login: { ok, token },
      } = data
      if (ok) {
        console.log(token)
      }
    },
  })

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    loginMutation({ variables: { loginInput: data } })
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-lg rounded-lg bg-white pt-5 pb-7 text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 grid gap-3 px-5 text-left"
        >
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError>{errors.email.message}</FormError>
          )}
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: 3,
            })}
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError>{errors.password.message}</FormError>
          )}
          {errors.password?.type === 'minLength' && (
            <FormError>Password must be more than 2 chars</FormError>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Log In'}
          </button>
          {loginMutationResult?.login.error && (
            <FormError>{loginMutationResult.login.error}</FormError>
          )}
        </form>
      </div>
    </div>
  )
}
