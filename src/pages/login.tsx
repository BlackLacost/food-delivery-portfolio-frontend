import { useMutation } from '@apollo/client'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { authTokenVar, isLoggedInVar } from '../apollo'
import { Button } from '../components/button'
import { FormError } from '../components/form-error'
import { Logo } from '../components/logo'
import { LOCALSTORAGE_TOKEN } from '../constants'
import { LoginForm } from '../form.validators'
import { graphql } from '../gql'

const Login = graphql(`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`)

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    mode: 'onChange',
    resolver: classValidatorResolver(LoginForm),
  })

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation(
    Login,
    {
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
    }
  )

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
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
            {...register('email')}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError>{errors.email.message}</FormError>
          )}
          <input
            {...register('password')}
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
