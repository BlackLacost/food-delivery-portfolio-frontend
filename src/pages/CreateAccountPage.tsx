import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { authTokenVar, isLoggedInVar } from '../apollo'
import { Button } from '../components/Button'
import { FormError } from '../components/FormError'
import { Logo } from '../components/Logo'
import { LOCALSTORAGE_TOKEN } from '../constants'
import { GetAddress, Position } from '../features/yandex-map/GetAddress'
import { CreateAccountForm, createAccountSchema } from '../form.schemas'
import { graphql } from '../gql'
import { UserRole } from '../gql/graphql'
import { notify } from '../toast'

const ROLES = [
  { role: UserRole.Client, label: 'Клиент' },
  { role: UserRole.Owner, label: 'Владелец' },
  { role: UserRole.Driver, label: 'Водитель' },
]

const CreateAccount = graphql(`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      token
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

export const CreateAccountPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateAccountForm>({
    mode: 'onChange',
    defaultValues: { role: UserRole.Client },
    resolver: yupResolver(createAccountSchema),
  })

  const [createAccountMutation, { loading }] = useMutation(CreateAccount, {
    onCompleted: ({ createAccount: { error, token } }) => {
      if (error) return notify.error(error.message)

      if (token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, token)
        authTokenVar(token)
        isLoggedInVar(true)
        navigate('/')
      }
    },
    onError: (error) => {
      console.log('!!!', JSON.stringify(error, null, 2))
    },
  })

  const userRole = watch('role')

  const onSubmit: SubmitHandler<CreateAccountForm> = ({
    email,
    password,
    role,
  }) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
            ...(clientPosition.address && { address: clientPosition.address }),
            ...(clientPosition.coords &&
              clientPosition.coords.length === 2 && {
                latitude: clientPosition.coords[0],
                longitude: clientPosition.coords[1],
              }),
          },
        },
      })
    }
  }

  const [clientPosition, setClientPosition] = useState<Position>({})

  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <Helmet>
        <title>Создать Аккаунт | Доставка Еды</title>
      </Helmet>
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        <Logo className="mb-10 w-60" />

        {userRole === UserRole.Client && (
          <>
            <p className="mb-2 w-full text-xl">
              Укажите ваш адрес доставки на карте
            </p>
            <GetAddress
              position={clientPosition}
              setPosition={setClientPosition}
            />
          </>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-5 grid w-full gap-3 text-left"
        >
          <input
            {...register('email')}
            type="email"
            placeholder="Почта"
            className="input"
          />
          {errors.email?.message && (
            <FormError>{errors.email.message}</FormError>
          )}
          {errors.email?.type === 'pattern' && (
            <FormError>Please enter a valid email</FormError>
          )}
          <input
            {...register('password')}
            type="password"
            placeholder="Пароль"
            className="input"
          />
          {errors.password?.message && (
            <FormError>{errors.password.message}</FormError>
          )}
          <select {...register('role')} className="input">
            {Object.keys(UserRole).map((role) => (
              <option key={role} value={role}>
                {ROLES.find((r) => r.role === role)?.label}
              </option>
            ))}
          </select>

          <Button canClick={isValid} loading={loading}>
            Создать аккаунт
          </Button>
        </form>
        <div>
          Уже есть аккаунт?{' '}
          <Link to="/" className="text-primary-600 hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  )
}
