import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { authTokenVar, isLoggedInVar } from '../apollo'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Logo } from '../components/Logo'
import { LOCALSTORAGE_TOKEN } from '../constants'
import { LoginForm, loginSchema } from '../form.schemas'
import { graphql } from '../gql'
import { notify } from '../toast'

const Login = graphql(`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      error {
        ... on Error {
          message
        }
      }
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
    resolver: yupResolver(loginSchema),
  })

  const [loginMutation, { loading }] = useMutation(Login, {
    onCompleted: ({ login: { token, error } }) => {
      if (error) {
        return notify.error(error.message)
      }

      if (token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, token)
        authTokenVar(token)
        isLoggedInVar(true)
      }
    },
  })

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    if (!loading) {
      loginMutation({ variables: { loginInput: data } })
    }
  }
  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <Helmet>
        <title>Вход | Доставка Еды</title>
      </Helmet>
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        <Logo className="mb-10 w-60" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-5 grid w-full gap-3 text-left"
        >
          <Input
            registerProps={register('email')}
            type="email"
            error={errors.email}
            placeholder="Почта"
          />
          <Input
            registerProps={register('password')}
            type="password"
            error={errors.password}
            placeholder="Пароль"
          />

          <Button canClick={isValid} loading={loading}>
            Войти
          </Button>
        </form>
        <div>
          Еще нет аккаунта?{' '}
          <Link
            to="/create-account"
            className="text-primary-600 hover:underline"
          >
            Создать аккаунт
          </Link>
        </div>
      </div>
    </div>
  )
}
