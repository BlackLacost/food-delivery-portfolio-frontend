import { gql, useMutation } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { authTokenVar, isLoggedInVar } from '../apollo'
import { Button } from '../components/button'
import { FormError } from '../components/form-error'
import { Logo } from '../components/logo'
import { LOCALSTORAGE_TOKEN } from '../constants'
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
    formState: { errors, isValid },
  } = useForm<LoginInput>({ mode: 'onChange' })

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const {
        login: { ok, token },
      } = data
      if (ok && token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, token)
        authTokenVar(token)
        isLoggedInVar(true)
      }
    },
  })

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    if (!loading) {
      loginMutation({ variables: { loginInput: data } })
    }
  }
  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <Helmet>
        <title>Login | Uber Eats</title>
      </Helmet>
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        <Logo className="mb-10 w-60" />
        <div className="w-full text-left text-3xl font-medium">
          Welcome back
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-5 grid w-full gap-3 text-left"
        >
          <input
            {...register('email', {
              required: 'Email is required',
              pattern:
                /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/,
            })}
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
            className="input transi"
          />
          {errors.password?.message && (
            <FormError>{errors.password.message}</FormError>
          )}
          {errors.password?.type === 'minLength' && (
            <FormError>Password must be more than 2 chars</FormError>
          )}

          <Button canClick={isValid} loading={loading}>
            Log In
          </Button>
          {loginMutationResult?.login.error && (
            <FormError>{loginMutationResult.login.error}</FormError>
          )}
        </form>
        <div>
          New to Uber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}
